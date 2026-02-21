import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { MenuItemRow, Order, OrderItem } from '../types/database.types';

export type { Order, OrderItem };

export type CartItemInput = { menuItemId: string; quantity: number; unitPrice: number };
export type OrderWithItems = Order & {
    order_items: (OrderItem & { menu_items: MenuItemRow | null })[];
};

export async function placeOrder(
    userId: string, restaurantId: string, items: CartItemInput[], totalPrice: number,
): Promise<string> {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: userId, restaurant_id: restaurantId, total_price: totalPrice, status: 'pending' } as any)
        .select().single();
    if (orderError) throw orderError;
    const orderId = (order as any).id as string;
    const orderItems = items.map((i) => ({
        order_id: orderId, menu_item_id: i.menuItemId, quantity: i.quantity, unit_price: i.unitPrice,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems as any);
    if (itemsError) throw itemsError;
    return orderId;
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
        .from('orders').select('*, order_items(*, menu_items(*))').eq('id', orderId).single();
    if (error) throw error;
    return data as OrderWithItems | null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Order[];
}

export function subscribeToOrderStatus(
    orderId: string, onUpdate: (status: Order['status']) => void,
): RealtimeChannel {
    return supabase
        .channel(`order_status:${orderId}`)
        .on('postgres_changes', {
            event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}`,
        }, (payload) => {
            const newStatus = payload.new?.status as Order['status'];
            if (newStatus) onUpdate(newStatus);
        })
        .subscribe();
}
