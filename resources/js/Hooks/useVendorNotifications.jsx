import { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import webApi from "@/lib/webApi";

export default function useVendorNotifications() {
    const { auth } = usePage().props;
    const userId = auth?.user?.id;

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const unreadCount = useMemo(
        () => items.filter((n) => !n.read_at).length,
        [items]
    );

    const fetchAll = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await webApi.get(route("vendor.notifications.index"), { params: { limit: 20 } });
            setItems(res.data.notifications || []);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        setItems((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
        );
        await webApi.post(route("vendor.notifications.read", id));
    };

    const markAllAsRead = async () => {
        setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
        await webApi.post(route("vendor.notifications.read-all"));
    };

    useEffect(() => {
        fetchAll();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        if (!window.Echo) return;

        const channelName = `App.Models.User.${userId}`;
        const channel = window.Echo.private(channelName);

        channel.notification((payload) => {
            const newItem = {
                id: payload?.id ?? crypto.randomUUID(),
                type: payload?.type ?? "broadcast",
                data: payload?.data ?? {},        // FIX: ambil payload.data, bukan payload full
                read_at: null,
                created_at: payload?.created_at ?? new Date().toISOString(),
            };
            setItems((prev) => [newItem, ...prev].slice(0, 20));
        });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [userId]);

    return {
        loading,
        items,
        unreadCount,
        fetchAll,
        markAsRead,
        markAllAsRead,
    };
}
