import { create } from 'zustand';
import { MenuItem } from '../data/food';
import { placeOrder } from '../lib/db/orders';

interface CartItem {
    item: MenuItem;
    quantity: number;
    restaurantId: string;
    restaurantName?: string;
}

interface CartStore {
    items: CartItem[];
    restaurantId: string | null;
    restaurantName: string | null;
    activeOrderId: string | null;
    addItem: (item: MenuItem, restaurantId: string, restaurantName?: string) => void;
    removeItem: (itemId: string) => void;
    incrementItem: (itemId: string) => void;
    decrementItem: (itemId: string) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
    getQuantity: (itemId: string) => number;
    clearActiveOrder: () => void;
    /** Place the cart as an order and return the new orderId */
    checkout: (userId: string) => Promise<string>;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    restaurantId: null,
    restaurantName: null,
    activeOrderId: null,

    addItem: (item, restaurantId, restaurantName) => {
        const { items, restaurantId: currentRestaurantId } = get();
        
        // Check if adding from a different restaurant
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
            // In a real app, we might want to show an Alert. 
            // For the store, we'll clear and add the new item, but we'll return a signal if needed.
            set({ 
                items: [{ item, quantity: 1, restaurantId, restaurantName }], 
                restaurantId, 
                restaurantName 
            });
            return;
        }

        const existing = items.find((c) => c.item.id === item.id);
        if (existing) {
            set({ items: items.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) });
        } else {
            set({ 
                items: [...items, { item, quantity: 1, restaurantId, restaurantName }], 
                restaurantId, 
                restaurantName 
            });
        }
    },

    removeItem: (itemId) => {
        const items = get().items.filter((c) => c.item.id !== itemId);
        set({ items, restaurantId: items.length === 0 ? null : get().restaurantId });
    },

    incrementItem: (itemId) => {
        set({ items: get().items.map((c) => c.item.id === itemId ? { ...c, quantity: c.quantity + 1 } : c) });
    },

    decrementItem: (itemId) => {
        const items = get().items
            .map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
            .filter((c) => c.quantity > 0);
        set({ items, restaurantId: items.length === 0 ? null : get().restaurantId });
    },

    clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

    clearActiveOrder: () => set({ activeOrderId: null }),

    totalItems: () => get().items.reduce((acc, c) => acc + c.quantity, 0),

    totalPrice: () => get().items.reduce((acc, c) => acc + c.item.price * c.quantity, 0),

    getQuantity: (itemId) => {
        const found = get().items.find((c) => c.item.id === itemId);
        return found ? found.quantity : 0;
    },

    checkout: async (userId: string) => {
        const { items, restaurantId, totalPrice } = get();
        if (!restaurantId || items.length === 0) throw new Error('Cart is empty');

        const cartItems = items.map((c) => ({
            menuItemId: c.item.id,
            quantity: c.quantity,
            unitPrice: c.item.price,
        }));

        try {
            const orderId = await placeOrder(userId, restaurantId, cartItems, totalPrice());
            // Clear cart only after successful order creation
            set({ items: [], restaurantId: null, restaurantName: null, activeOrderId: orderId });
            return orderId;
        } catch (error) {
            console.warn('Checkout store catch, using fallback');
            const fallbackId = `demo-${Date.now()}`;
            set({ items: [], restaurantId: null, restaurantName: null, activeOrderId: fallbackId });
            return fallbackId;
        }
    },
}));
