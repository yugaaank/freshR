import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { CartItemInput, Order } from '../lib/db/orders';
import { getOrderById, getUserOrders, placeOrder, subscribeToOrderStatus } from '../lib/db/orders';

export const orderKeys = {
    all: (uid: string) => ['orders', uid] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
};

/** Place a new order (cart checkout) */
export function usePlaceOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: {
            userId: string;
            restaurantId: string;
            items: CartItemInput[];
            totalPrice: number;
        }) => placeOrder(vars.userId, vars.restaurantId, vars.items, vars.totalPrice),
        onSuccess: (_, { userId }) => {
            qc.invalidateQueries({ queryKey: orderKeys.all(userId) });
        },
    });
}

/** Order detail */
export function useOrder(orderId: string | null) {
    return useQuery({
        queryKey: orderKeys.detail(orderId ?? ''),
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
        staleTime: 5_000, // short — status changes frequently
    });
}

/** User order history */
export function useUserOrders(userId: string | null) {
    return useQuery({
        queryKey: orderKeys.all(userId ?? ''),
        queryFn: () => getUserOrders(userId!),
        enabled: !!userId,
        staleTime: 30_000,
    });
}

/** Live order status via Supabase Realtime */
export function useOrderStatus(orderId: string | null) {
    const [status, setStatus] = useState<Order['status'] | null>(null);
    const qc = useQueryClient();

    useEffect(() => {
        if (!orderId) return;

        // Seed initial status from cache/query
        const cached = qc.getQueryData<Order | null>(orderKeys.detail(orderId));
        if (cached?.status) setStatus(cached.status);

        const channel = subscribeToOrderStatus(orderId, (newStatus) => {
            setStatus(newStatus);
            qc.setQueryData(orderKeys.detail(orderId), (old: any) =>
                old ? { ...old, status: newStatus } : old,
            );
        });
        return () => { channel.unsubscribe(); };
    }, [orderId, qc]);

    return status;
}
