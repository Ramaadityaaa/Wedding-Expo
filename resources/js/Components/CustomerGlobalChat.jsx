import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, X, Send, ChevronLeft, Loader2 } from "lucide-react";

export default function CustomerGlobalChat({ user, initialChatUser = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState("list"); // 'list' atau 'room'

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // --- HELPER FUNCTIONS (Definisikan dulu sebelum dipakai di useEffect) ---

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current)
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
    };

    const fetchConversations = () => {
        axios.get(route("chat.conversations")).then((res) => {
            setConversations(res.data);
        });
    };

    const openChat = (chatUser) => {
        setActiveChat(chatUser);
        setView("room");
        setLoading(true);
        // Pastikan widget terbuka (penting jika dipanggil dari luar)
        setIsOpen(true);

        axios.get(route("chat.get", chatUser.id)).then((res) => {
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
        });
    };

    const backToList = () => {
        setView("list");
        setActiveChat(null);
        fetchConversations();
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const tempMsg = {
            id: Date.now(),
            sender_id: user.id,
            message: newMessage,
            created_at: new Date().toISOString(),
        };

        setMessages([...messages, tempMsg]);
        setNewMessage("");
        scrollToBottom();

        axios
            .post(route("chat.send"), {
                receiver_id: activeChat.id,
                message: tempMsg.message,
            })
            .then(() => {
                fetchConversations();
            });
    };

    // --- USE EFFECTS (Ditaruh di bawah agar bisa baca fungsi di atas) ---

    // 1. Auto-open jika ada props initialChatUser (Dari tombol "Chat Vendor")
    useEffect(() => {
        if (initialChatUser) {
            openChat(initialChatUser);
        }
    }, [initialChatUser]);

    // 2. Load Conversation & Listen Realtime
    useEffect(() => {
        if (isOpen) {
            fetchConversations();
        }

        if (user) {
            const channel = window.Echo.private(`chat.${user.id}`).listen(
                "MessageSent",
                (e) => {
                    fetchConversations();
                    if (activeChat && e.message.sender_id === activeChat.id) {
                        setMessages((prev) => [...prev, e.message]);
                        scrollToBottom();
                    }
                }
            );
            return () => channel.stopListening("MessageSent");
        }
    }, [isOpen, activeChat, user]);

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* --- WINDOW CHAT POPUP --- */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center gap-2">
                            {view === "room" && (
                                <button
                                    onClick={backToList}
                                    className="mr-1 hover:bg-white/20 p-1 rounded-full"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                            <h4 className="font-bold text-md">
                                {view === "list"
                                    ? "Pesan Saya"
                                    : activeChat?.name}
                            </h4>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT: LIST VIEW */}
                    {view === "list" && (
                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-6 text-center">
                                    <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                                    Belum ada percakapan.
                                    <br />
                                    Chat vendor dari halaman detail!
                                </div>
                            ) : (
                                conversations.map((chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => openChat(chat)}
                                        className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white hover:bg-amber-50 cursor-pointer transition"
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                                                {chat.avatar ? (
                                                    <img
                                                        src={chat.avatar}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    chat.name.charAt(0)
                                                )}
                                            </div>
                                            {chat.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                                    {chat.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h5 className="font-bold text-gray-800 text-sm truncate">
                                                    {chat.name}
                                                </h5>
                                                <span className="text-[10px] text-gray-400">
                                                    {chat.last_time}
                                                </span>
                                            </div>
                                            <p
                                                className={`text-xs truncate ${
                                                    chat.unread_count > 0
                                                        ? "font-bold text-gray-800"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {chat.last_message}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* CONTENT: ROOM VIEW */}
                    {view === "room" && (
                        <>
                            <div
                                className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3"
                                ref={scrollRef}
                            >
                                {loading ? (
                                    <div className="flex justify-center mt-10">
                                        <Loader2 className="animate-spin text-amber-500" />
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === user.id;
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
                                                    className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm ${
                                                        isMe
                                                            ? "bg-amber-500 text-white rounded-br-none"
                                                            : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                                                    }`}
                                                >
                                                    <p>{msg.message}</p>
                                                    <span
                                                        className={`text-[9px] block text-right mt-1 ${
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
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* INPUT */}
                            <form
                                onSubmit={handleSend}
                                className="p-3 bg-white border-t border-gray-100 flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    placeholder="Tulis pesan..."
                                    className="flex-1 bg-gray-100 border-none rounded-full px-4 text-sm focus:ring-1 focus:ring-amber-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="text-amber-500 hover:bg-amber-50 p-2 rounded-full transition"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* --- FLOATING TOGGLE BUTTON --- */}
            {/* Tombol ini akan disembunyikan jika kita sedang di mode 'room' dan window terbuka (opsional, tapi saya biarkan visible) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center relative"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}

                {/* Total Unread Badge (Global) */}
                {!isOpen &&
                    conversations.reduce(
                        (acc, curr) => acc + curr.unread_count,
                        0
                    ) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                            {conversations.reduce(
                                (acc, curr) => acc + curr.unread_count,
                                0
                            )}
                        </span>
                    )}
            </button>
        </div>
    );
}
