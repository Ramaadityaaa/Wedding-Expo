import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";

export default function AdminNotificationsBell() {
    const { auth } = usePage().props;
    const userId = auth?.user?.id;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);

    const mountedRef = useRef(false);

    const latestItems = useMemo(() => {
        return Array.isArray(items) ? items.slice(0, 8) : [];
    }, [items]);

    const axiosGet = useCallback((url, config) => {
        const ax = window.axios;
        if (!ax) throw new Error("window.axios belum tersedia. Pastikan resources/js/bootstrap.js menginisialisasi axios.");
        return ax.get(url, config);
    }, []);

    const axiosPost = useCallback((url, data = {}, config) => {
        const ax = window.axios;
        if (!ax) throw new Error("window.axios belum tersedia. Pastikan resources/js/bootstrap.js menginisialisasi axios.");
        return ax.post(url, data, config);
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await axiosGet("/admin/notifications", { params: { limit: 8 } });

            const notifications = res?.data?.notifications ?? [];
            const unreadCount = res?.data?.unread_count ?? 0;

            if (!mountedRef.current) return;

            setItems(Array.isArray(notifications) ? notifications : []);
            setUnread(Number.isFinite(unreadCount) ? unreadCount : 0);
        } catch (e) {
            console.error("Fetch admin notifications failed:", e);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [axiosGet, userId]);

    const markRead = useCallback(
        async (id) => {
            if (!id) return;

            try {
                await axiosPost(`/admin/notifications/${id}/read`);

                if (!mountedRef.current) return;

                setItems((prev) => {
                    const arr = Array.isArray(prev) ? prev : [];
                    return arr.map((n) =>
                        n?.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n
                    );
                });

                setUnread((prevUnread) => Math.max(0, (Number(prevUnread) || 0) - 1));
            } catch (e) {
                console.error("Mark read admin failed:", e);
            }
        },
        [axiosPost]
    );

    const markAllRead = useCallback(async () => {
        try {
            await axiosPost("/admin/notifications/read-all");

            if (!mountedRef.current) return;

            setItems((prev) => {
                const arr = Array.isArray(prev) ? prev : [];
                return arr.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }));
            });

            setUnread(0);
        } catch (e) {
            console.error("Mark all read admin failed:", e);
        }
    }, [axiosPost]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!userId) return;
        fetchNotifications();
    }, [userId, fetchNotifications]);

    useEffect(() => {
        if (!open) return;
        fetchNotifications();
    }, [open, fetchNotifications]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    useEffect(() => {
        if (!userId) return;
        if (!window.Echo) return;

        const channelName = `App.Models.User.${userId}`;
        let subscribed = false;

        try {
            const channel = window.Echo.private(channelName);
            subscribed = true;

            channel.notification((payload) => {
                if (!mountedRef.current) return;

                const normalized = {
                    id: payload?.id,
                    type: payload?.type,
                    data: payload?.data ?? {},
                    created_at: payload?.created_at ?? new Date().toISOString(),
                    read_at: null,
                };

                setItems((prev) => {
                    const arr = Array.isArray(prev) ? prev : [];
                    const exists = normalized.id && arr.some((x) => x?.id === normalized.id);
                    const next = exists ? arr : [normalized, ...arr];
                    return next.slice(0, 50);
                });

                setUnread((u) => (Number(u) || 0) + 1);
            });
        } catch (e) {
            console.error("Echo admin subscribe failed:", e);
        }

        return () => {
            if (!subscribed) return;
            try {
                window.Echo.leave(channelName);
            } catch (e) {
                console.error("Echo leave failed:", e);
            }
        };
    }, [userId]);

    return (
        <div className="relative z-50">
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen((v) => !v);
                }}
                className="p-2.5 rounded-full text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors relative"
                aria-label="Admin notifications"
                title="Notifikasi Admin"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(false);
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    />

                    <div
                        className="absolute right-0 mt-3 w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800">Notifikasi</span>
                                {unread > 0 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                                        {unread} baru
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    markAllRead();
                                }}
                                disabled={items.length === 0 || unread === 0}
                                className="text-xs font-semibold text-slate-600 hover:text-orange-600 inline-flex items-center gap-1 disabled:opacity-50 disabled:hover:text-slate-600"
                            >
                                <CheckCheck size={14} />
                                Tandai semua
                            </button>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto">
                            {loading ? (
                                <div className="p-6 flex items-center justify-center text-slate-500 gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    Memuat...
                                </div>
                            ) : latestItems.length === 0 ? (
                                <div className="p-6 text-sm text-slate-500">Belum ada notifikasi.</div>
                            ) : (
                                latestItems.map((n) => {
                                    const title = n?.data?.title ?? "Aktivitas baru";
                                    const message = n?.data?.message ?? n?.data?.body ?? "Ada update baru pada panel admin.";
                                    const url = n?.data?.url ?? null;
                                    const isUnread = !n?.read_at;

                                    return (
                                        <div
                                            key={n?.id ?? `${n?.type ?? "notif"}-${n?.created_at ?? Math.random()}`}
                                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                                                isUnread ? "bg-orange-50/40" : "bg-white"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{title}</p>
                                                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{message}</p>

                                                    <div className="mt-2 flex items-center gap-2">
                                                        {url && (
                                                            <a
                                                                href={url}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                                                            >
                                                                Buka
                                                                <ExternalLink size={12} />
                                                            </a>
                                                        )}

                                                        {isUnread && (
                                                            <button
                                                                type="button"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    markRead(n.id);
                                                                }}
                                                                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                                                            >
                                                                Tandai dibaca
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {isUnread && <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                            <Link
                                href={route("admin.dashboard")}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-bold text-slate-700 hover:text-orange-600"
                            >
                                Ke dashboard →
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
