import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore, collection, query, orderBy, onSnapshot, 
    addDoc, serverTimestamp, doc, setDoc, getDoc,
    where, limit 
} from 'firebase/firestore';
import { 
    MessageSquare, Search, Phone, Video, Paperclip, Send, 
    Lock, User, ChevronDown, LogOut, Loader2 
} from 'lucide-react'; // Menggunakan Lucide untuk ikon

// --- GLOBAL VARIABLES (Provided by Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- UTILITY: Firebase & Auth Setup ---
const initializeFirebase = async () => {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        let userId = null;
        let isAuthReady = false;

        // Sign in using custom token or anonymously
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken).catch(e => {
                console.error("Custom token sign-in failed, trying anonymous:", e);
                return signInAnonymously(auth);
            });
        } else {
            await signInAnonymously(auth);
        }

        // Wait for auth state to settle
        const user = await new Promise(resolve => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    userId = user.uid;
                    isAuthReady = true;
                    unsubscribe();
                    resolve(user);
                } else {
                    isAuthReady = true;
                    resolve(null);
                }
            });
        });

        return { db, auth, userId, isAuthReady, user };
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return { db: null, auth: null, userId: null, isAuthReady: true, user: null };
    }
};

// --- MOCK DATA ---
const mockContacts = [
    { id: 'chat_1', name: 'Customer Aulia', role: 'CUSTOMER', avatar: 'https://placehold.co/40x40/fcd34d/525252?text=C', lastMessage: 'Destorm wungasir tosireih Itala' },
    { id: 'chat_2', name: 'Vendor Bunga Indah', role: 'VENDOR', avatar: 'https://placehold.co/40x40/fcd34d/525252?text=V', lastMessage: 'Destorm nungasil losiutt eritulo', isActive: true },
    { id: 'chat_3', name: 'Admin Support', role: 'ADMIN', avatar: 'https://placehold.co/40x40/10b981/ffffff?text=A', lastMessage: 'Destorm wungasir tosireih Itala' },
    { id: 'chat_4', name: 'Customer Bagas', role: 'CUSTOMER', avatar: 'https://placehold.co/40x40/fcd34d/525252?text=B', lastMessage: 'Destorm wungasir tosireih Itala' },
];

// --- CORE COMPONENTS ---

// Komponen Input dengan Ikon
const ChatInput = ({ message, setMessage, handleSend, processing }) => (
    <div className="flex items-center p-4 border-t border-gray-100 bg-white">
        <button className="p-2 text-gray-400 hover:text-amber-500 transition-colors">
            <Paperclip className="h-5 w-5" />
        </button>
        <input
            type="text"
            placeholder="Tulis pesan..."
            className="flex-1 mx-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 transition duration-150"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
            disabled={processing}
        />
        <button 
            onClick={handleSend}
            disabled={!message.trim() || processing}
            className={`p-3 rounded-full transition-all duration-300 ${
                message.trim()
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50 hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
            {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
    </div>
);

// Komponen Bubble Pesan
const MessageBubble = ({ message, isOwn, currentUserName }) => {
    const bubbleClass = isOwn
        ? "bg-amber-500 text-white rounded-t-xl rounded-bl-xl ml-auto"
        : message.senderRole === 'ADMIN'
            ? "bg-green-100 text-gray-800 rounded-t-xl rounded-br-xl mr-auto"
            : "bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl mr-auto";
    
    // Gunakan nama pengirim dari data atau nama pengguna saat ini jika itu adalah pesan sendiri
    const senderName = isOwn ? currentUserName : message.senderName || message.senderRole;
    
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 shadow-md ${bubbleClass}`}>
                <div className="font-semibold text-xs mb-1 opacity-80">
                    {senderName}
                </div>
                <div>{message.text}</div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function ChatApp() {
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUserName, setCurrentUserName] = useState("Pengguna Aktif");
    const [userRole, setUserRole] = useState("VENDOR"); // Mock role for chat color logic
    
    const [contacts, setContacts] = useState(mockContacts);
    const [selectedChat, setSelectedChat] = useState(mockContacts.find(c => c.isActive) || mockContacts[0]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    
    const messagesEndRef = useRef(null);

    // 1. Initialize Firebase & Auth
    useEffect(() => {
        const init = async () => {
            const { db, userId, isAuthReady, user } = await initializeFirebase();
            setDb(db);
            setUserId(userId);
            setIsAuthReady(isAuthReady);
            if (user) {
                // Di aplikasi nyata, Anda akan mengambil nama dan peran dari database
                setCurrentUserName(`User-${userId.substring(0, 4)}`);
                // Mocking role based on a simple check
                // setUserRole(user.customClaims?.role || 'CUSTOMER'); 
            }
        };
        init();
    }, []);

    // 2. Real-time Message Listener
    useEffect(() => {
        if (!db || !isAuthReady || !selectedChat.id) return;

        // Path: /artifacts/{appId}/public/data/chats/{chatId}/messages
        const chatPath = `/artifacts/${appId}/public/data/chats/${selectedChat.id}/messages`;
        const q = query(collection(db, chatPath), orderBy("timestamp", "asc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        }, (error) => {
            console.error("Error fetching messages:", error);
        });

        return () => unsubscribe();
    }, [db, isAuthReady, selectedChat.id]);

    // 3. Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // 4. Send Message Handler
    const handleSend = async () => {
        if (!newMessage.trim() || !db || !userId) return;
        setProcessing(true);
        
        // Path: /artifacts/{appId}/public/data/chats/{chatId}/messages
        const chatPath = `/artifacts/${appId}/public/data/chats/${selectedChat.id}/messages`;
        
        const messagePayload = {
            text: newMessage.trim(),
            senderId: userId,
            senderName: currentUserName,
            senderRole: userRole,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, chatPath), messagePayload);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setProcessing(false);
        }
    };
    
    // Show loading until auth is ready
    if (!isAuthReady) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <span className="ml-3 text-lg text-gray-600">Memuat Obrolan...</span>
            </div>
        );
    }


    return (
        <div className="p-8 min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundImage: 'linear-gradient(to right bottom, #fff7ed, #fef3c7)' }}>
            <div className="w-full max-w-6xl h-[80vh] min-h-[600px] shadow-3xl rounded-3xl overflow-hidden bg-white border border-gray-100">
                <div className="flex h-full">
                    
                    {/* LEFT PANEL: Contact List (Kontak) */}
                    <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-3xl font-extrabold text-amber-700 flex items-center">
                                <MessageSquare className="w-7 h-7 mr-2" /> Chat
                            </h2>
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                />
                            </div>
                        </div>

                        {/* Contact Items */}
                        <div className="flex-1 overflow-y-auto">
                            {contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedChat(contact)}
                                    className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                                        selectedChat.id === contact.id
                                            ? 'bg-amber-100 border-l-4 border-amber-500'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Avatar (Mocked with different colors for roles) */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                                        contact.role === 'VENDOR' ? 'bg-amber-500' : 
                                        contact.role === 'ADMIN' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}>
                                        {contact.avatar.charAt(40) || contact.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 truncate">
                                        <div className="font-semibold text-gray-800">{contact.name}</div>
                                        <div className="text-sm text-gray-500 truncate">{contact.lastMessage}</div>
                                    </div>
                                    {selectedChat.id === contact.id && (
                                        <ChevronDown className="w-4 h-4 text-amber-500 rotate-270" />
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer (User Logout Mock) */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-amber-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">{currentUserName} ({userRole})</span>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Chat Window (Jendela Obrolan) */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-50">
                            <div className="flex items-center">
                                {/* Current Contact Info */}
                                <div className="w-10 h-10 rounded-full bg-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{selectedChat.name}</h3>
                                    <p className="text-sm text-gray-500">online / gunakan akun email Anda</p>
                                </div>
                            </div>
                            
                            {/* Call/Video Buttons */}
                            <div className="flex space-x-2">
                                <button className="p-2 rounded-full text-gray-600 hover:bg-white hover:text-amber-600 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full text-gray-600 hover:bg-white hover:text-amber-600 transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 pt-10">Mulai percakapan dengan {selectedChat.name}</div>
                            )}
                            {messages.map((msg) => (
                                <MessageBubble 
                                    key={msg.id} 
                                    message={msg} 
                                    isOwn={msg.senderId === userId} 
                                    currentUserName={currentUserName}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-2 border-t border-gray-100 bg-white">
                            {/* Area Input Pesan */}
                            <ChatInput 
                                message={newMessage} 
                                setMessage={setNewMessage} 
                                handleSend={handleSend} 
                                processing={processing}
                            />
                            
                            {/* Tombol Kunci/Status */}
                            <div className="flex justify-end p-2 text-gray-400">
                                <Lock className="w-4 h-4 mr-1" />
                                <span className="text-xs">Chat diamankan dan dienkripsi ujung ke ujung (Mock)</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}