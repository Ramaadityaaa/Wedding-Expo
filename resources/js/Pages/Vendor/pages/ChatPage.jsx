import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import axios from "axios";
import { Send, Search, MessageSquare, Loader2, CheckCheck } from "lucide-react";

export default function ChatPage({ auth }) {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // User ID yang sedang dibuka
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const currentUser = auth.user;

    // 1. Load Daftar Kontak
    const fetchConversations = () => {
        axios.get(route("chat.conversations")).then((res) => {
            setConversations(res.data);
        });
    };

    useEffect(() => {
        fetchConversations();

        // Listen notifikasi global jika ada pesan masuk dari siapa saja
        window.Echo.private(`chat.${currentUser.id}`).listen(
            "MessageSent",
            (e) => {
                fetchConversations(); // Refresh list kontak biar pesan terakhir update

                // Jika pesan dari orang yang sedang kita buka, masukkan ke chat room
                if (activeChat && e.message.sender_id === activeChat.id) {
                    setMessages((prev) => [...prev, e.message]);
                    scrollToBottom();
                }
            }
        );

        return () => window.Echo.leave(`chat.${currentUser.id}`);
    }, [activeChat]);

    // 2. Buka Chat Room
    const openChat = (user) => {
        setActiveChat(user);
        setLoading(true);
        axios.get(route("chat.get", user.id)).then((res) => {
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
            // TODO: Tandai read di sini nanti
        });
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current)
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
    };

    // 3. Kirim Pesan
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

    return (
        <VendorLayout user={auth.user} header="Pesan & Chat">
            <Head title="Chat Vendor" />

            <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex">
                {/* --- SIDEBAR KIRI (DAFTAR KONTAK) --- */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari percakapan..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="text-center p-8 text-gray-400 text-sm">
                                Belum ada percakapan.
                            </div>
                        ) : (
                            conversations.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => openChat(chat)}
                                    className={`p-4 flex gap-3 cursor-pointer hover:bg-white transition border-b border-gray-50 ${
                                        activeChat?.id === chat.id
                                            ? "bg-white border-l-4 border-l-amber-500 shadow-sm"
                                            : ""
                                    }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                chat.avatar ||
                                                `https://ui-avatars.com/api/?name=${chat.name}`
                                            }
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {chat.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                                {chat.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-gray-800 truncate text-sm">
                                                {chat.name}
                                            </h4>
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
                </div>

                {/* --- AREA CHAT KANAN --- */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            activeChat.avatar ||
                                            `https://ui-avatars.com/api/?name=${activeChat.name}`
                                        }
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {activeChat.name}
                                        </h3>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
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
                                                    <p>{msg.message}</p>
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
                                        className="flex-1 bg-gray-100 border-none rounded-full px-5 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition shadow-md disabled:opacity-50"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-slate-50/50">
                            <MessageSquare className="w-20 h-20 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-gray-400">
                                Pilih percakapan untuk mulai chat
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </VendorLayout>
    );
}
