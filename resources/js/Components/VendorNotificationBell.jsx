import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import webApi from "@/lib/webApi";

export default function VendorNotificationBell() {
    const { auth } = usePage().props;
    const userId = auth?.user?.id;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);

    const panelRef = useRef(null);
    const mountedRef = useRef(false);

    const latestItems = useMemo(() => {
        return Array.isArray(items) ? items.slice(0, 8) : [];
    }, [items]);

    const formatTanggal = useCallback((isoOrDateString) => {
        if (!isoOrDateString) return "";

        const d = new Date(isoOrDateString);
        if (Number.isNaN(d.getTime())) return "";

        return d.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }, []);

    const formatJam = useCallback((isoOrDateString) => {
        if (!isoOrDateString) return "";

        const d = new Date(isoOrDateString);
        if (Number.isNaN(d.getTime())) return "";

        return d.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await webApi.get("/vendor/notifications", { params: { limit: 20 } });

            const notifications = res?.data?.notifications ?? [];
            const unreadCount = res?.data?.unread_count ?? 0;

            if (!mountedRef.current) return;

            setItems(Array.isArray(notifications) ? notifications : []);
            setUnread(Number.isFinite(unreadCount) ? unreadCount : 0);
        } catch (e) {
            console.error("Fetch notifications failed:", e);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [userId]);

    const markRead = useCallback(async (id) => {
        if (!id) return;

        try {
            await webApi.post(`/vendor/notifications/${id}/read`);

            if (!mountedRef.current) return;

            setItems((prev) => {
                const arr = Array.isArray(prev) ? prev : [];
                return arr.map((n) =>
                    n?.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n
                );
            });

            setUnread((prevUnread) => Math.max(0, (Number(prevUnread) || 0) - 1));
        } catch (e) {
            console.error("Mark read failed:", e);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await webApi.post("/vendor/notifications/read-all");

            if (!mountedRef.current) return;

            setItems((prev) => {
                const arr = Array.isArray(prev) ? prev : [];
                return arr.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }));
            });
            setUnread(0);
        } catch (e) {
            console.error("Mark all read failed:", e);
        }
    }, []);

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

        const onMouseDown = (e) => {
            if (!panelRef.current) return;
            if (!panelRef.current.contains(e.target)) setOpen(false);
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        fetchNotifications();
    }, [open, fetchNotifications]);

    useEffect(() => {
        if (!userId) return;

        const t = setInterval(() => {
            fetchNotifications();
        }, 15000);

        return () => clearInterval(t);
    }, [userId, fetchNotifications]);

    useEffect(() => {
        if (!userId) return;
        if (!window.Echo) return;

        const channelName = `App.Models.User.${userId}`;

        try {
            const channel = window.Echo.private(channelName);

            channel.notification(() => {
                fetchNotifications();
            });

            return () => {
                window.Echo.leave(channelName);
            };
        } catch (e) {
            console.error("Echo subscribe failed:", e);
        }
    }, [userId, fetchNotifications]);

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="p-2.5 rounded-full text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors relative"
                aria-label="Notifications"
                title="Notifikasi"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
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
                            onClick={markAllRead}
                            disabled={items.length === 0 || unread === 0}
                            className="text-xs font-semibold text-slate-600 hover:text-orange-600 inline-flex items-center gap-1 disabled:opacity-50"
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
                                const message =
                                    n?.data?.message ?? n?.data?.body ?? "Ada update baru pada akun vendor kamu.";
                                const url = n?.data?.url ?? null;
                                const isUnread = !n?.read_at;

                                // tampilkan tanggal order jika ada, fallback created_at notifikasi
                                const waktuUtama = n?.data?.order_date ?? n?.created_at;
                                const tanggal = formatTanggal(waktuUtama);
                                const jam = formatJam(n?.created_at);

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

                                                {(tanggal || jam) && (
                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                        {tanggal}
                                                        {jam ? `, ${jam}` : ""}
                                                    </p>
                                                )}

                                                <div className="mt-2 flex items-center gap-2">
                                                    {url && (
                                                        <a
                                                            href={url}
                                                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                                                        >
                                                            Buka
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}

                                                    {isUnread && (
                                                        <button
                                                            type="button"
                                                            onClick={() => markRead(n.id)}
                                                            className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                                                        >
                                                            Tandai dibaca
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {isUnread && (
                                                <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                        <Link href="/vendor/notifications-page" className="text-xs font-bold text-slate-700 hover:text-orange-600">
                            Lihat semua notifikasi →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
