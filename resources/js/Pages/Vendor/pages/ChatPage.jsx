import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import axios from "axios";
import {
    Send,
    Search,
    MessageSquare,
    Loader2,
    CheckCheck,
    Headset,
} from "lucide-react";

export default function ChatPage({ auth }) {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // User ID yang sedang dibuka
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const currentUser = auth.user;

    // --- 1. Load Daftar Kontak (Inbox) ---
    const fetchConversations = () => {
        axios.get(route("chat.conversations")).then((res) => {
            setConversations(res.data);
        });
    };

    // --- 2. Listen Real-time (Echo) ---
    useEffect(() => {
        fetchConversations();

        // Listen notifikasi global jika ada pesan masuk dari siapa saja ke user ini
        const channel = window.Echo.private(`chat.${currentUser.id}`).listen(
            "MessageSent",
            (e) => {
                fetchConversations(); // Refresh list kontak biar pesan terakhir update

                // Jika pesan dari orang yang sedang kita buka, masukkan ke chat room secara live
                if (activeChat && e.message.sender_id === activeChat.id) {
                    setMessages((prev) => [...prev, e.message]);
                    scrollToBottom();
                }
            }
        );

        return () => channel.stopListening("MessageSent");
    }, [activeChat]);

    // --- 3. Buka Chat Room ---
    const openChat = (user) => {
        setActiveChat(user);
        setLoading(true);
        axios.get(route("chat.get", user.id)).then((res) => {
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
        });
    };

    // Helper Scroll ke Bawah
    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current)
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
    };

    // --- 4. Kirim Pesan ---
    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const tempMsg = {
            id: Date.now(),
            sender_id: currentUser.id,
            message: newMessage,
            created_at: new Date().toISOString(),
            is_sending: true,
        };

        // Optimistic UI update
        setMessages([...messages, tempMsg]);
        setNewMessage("");
        scrollToBottom();

        axios
            .post(route("chat.send"), {
                receiver_id: activeChat.id,
                message: tempMsg.message,
            })
            .then(() => {
                fetchConversations(); // Update "Last Message" di sidebar
            });
    };

    // --- 5. Hubungi Admin Support ---
    const contactAdmin = () => {
        setLoading(true);
        axios
            .get(route("admin.contact"))
            .then((res) => {
                if (res.data.id) {
                    // Cegah chat diri sendiri jika kebetulan login sebagai admin (testing)
                    if (res.data.id === currentUser.id) {
                        alert("Anda tidak bisa chat diri sendiri.");
                        setLoading(false);
                        return;
                    }
                    openChat(res.data);
                } else {
                    alert("Akun Admin belum tersedia.");
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                alert("Gagal menghubungi server.");
            });
    };

    return (
        <VendorLayout user={auth.user} header="Pesan & Chat">
            <Head title="Chat Vendor" />

            <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex">
                {/* --- SIDEBAR KIRI (DAFTAR KONTAK) --- */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    {/* Header Sidebar: Support & Search */}
                    <div className="p-4 border-b border-gray-200 bg-white space-y-3">
                        {/* Tombol Support Admin */}
                        <button
                            onClick={contactAdmin}
                            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
                        >
                            <Headset size={18} />
                            Hubungi Admin Support
                        </button>

                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari percakapan..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500 transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="text-center p-8 text-gray-400 text-sm flex flex-col items-center">
                                <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                                <p>Belum ada percakapan.</p>
                            </div>
                        ) : (
                            conversations.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => openChat(chat)}
                                    className={`p-4 flex gap-3 cursor-pointer hover:bg-white transition border-b border-gray-100 ${
                                        activeChat?.id === chat.id
                                            ? "bg-amber-50 border-l-4 border-l-amber-500 shadow-inner"
                                            : ""
                                    }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {chat.avatar &&
                                            chat.avatar.startsWith("http") ? (
                                                <img
                                                    src={chat.avatar}
                                                    className="w-full h-full object-cover"
                                                    alt={chat.name}
                                                />
                                            ) : (
                                                <span className="font-bold text-gray-500 text-lg">
                                                    {chat.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        {chat.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                                                {chat.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4
                                                className={`truncate text-sm ${
                                                    chat.unread_count > 0
                                                        ? "font-bold text-gray-900"
                                                        : "font-semibold text-gray-700"
                                                }`}
                                            >
                                                {chat.name}
                                            </h4>
                                            <span className="text-[10px] text-gray-400">
                                                {chat.last_time}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-xs truncate ${
                                                chat.unread_count > 0
                                                    ? "font-semibold text-gray-800"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {chat.last_message ||
                                                "Lampiran Gambar"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- AREA CHAT KANAN --- */}
                <div className="flex-1 flex flex-col bg-white relative">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {activeChat.avatar &&
                                        activeChat.avatar.startsWith("http") ? (
                                            <img
                                                src={activeChat.avatar}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-bold text-gray-500">
                                                {activeChat.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {activeChat.name}
                                        </h3>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                                            Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div
                                className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4"
                                ref={scrollRef}
                            >
                                {loading ? (
                                    <div className="flex justify-center mt-10">
                                        <Loader2 className="animate-spin text-amber-500" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                                        <MessageSquare size={48} />
                                        <p className="mt-2 text-sm">
                                            Mulai percakapan dengan{" "}
                                            {activeChat.name}
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe =
                                            msg.sender_id === currentUser.id;
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex ${
                                                    isMe
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                                                        isMe
                                                            ? "bg-amber-500 text-white rounded-br-none"
                                                            : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                                                    }`}
                                                >
                                                    <p className="leading-relaxed">
                                                        {msg.message}
                                                    </p>
                                                    <div
                                                        className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${
                                                            isMe
                                                                ? "text-amber-100"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {new Date(
                                                            msg.created_at
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                        {isMe && (
                                                            <CheckCheck
                                                                size={14}
                                                                className="opacity-80"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form
                                    onSubmit={handleSend}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        placeholder="Ketik pesan balasan..."
                                        className="flex-1 bg-gray-100 border-none rounded-full px-5 focus:ring-2 focus:ring-amber-500 transition"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-slate-50/50">
                            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                                <MessageSquare className="w-16 h-16 text-amber-200" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">
                                Selamat Datang di Pusat Pesan
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Pilih percakapan untuk mulai chat
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </VendorLayout>
    );
}
