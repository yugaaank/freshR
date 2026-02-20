import { create } from 'zustand';
import { MenuItem } from '../data/food';

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
    addItem: (item: MenuItem, restaurantId: string, restaurantName?: string) => void;
    removeItem: (itemId: string) => void;
    incrementItem: (itemId: string) => void;
    decrementItem: (itemId: string) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
    getQuantity: (itemId: string) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    restaurantId: null,
    restaurantName: null,

    addItem: (item, restaurantId, restaurantName) => {
        const { items, restaurantId: currentRestaurantId } = get();
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
            // New restaurant — clear old cart
            set({
                items: [{ item, quantity: 1, restaurantId, restaurantName }],
                restaurantId,
                restaurantName,
            });
            return;
        }
        const existing = items.find((c) => c.item.id === item.id);
        if (existing) {
            set({
                items: items.map((c) =>
                    c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                ),
            });
        } else {
            set({
                items: [...items, { item, quantity: 1, restaurantId, restaurantName }],
                restaurantId,
                restaurantName,
            });
        }
    },

    removeItem: (itemId) => {
        const items = get().items.filter((c) => c.item.id !== itemId);
        set({ items, restaurantId: items.length === 0 ? null : get().restaurantId });
    },

    incrementItem: (itemId) => {
        set({
            items: get().items.map((c) =>
                c.item.id === itemId ? { ...c, quantity: c.quantity + 1 } : c
            ),
        });
    },

    decrementItem: (itemId) => {
        const items = get().items
            .map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
            .filter((c) => c.quantity > 0);
        set({ items, restaurantId: items.length === 0 ? null : get().restaurantId });
    },

    clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

    totalItems: () => get().items.reduce((acc, c) => acc + c.quantity, 0),

    totalPrice: () =>
        get().items.reduce((acc, c) => acc + c.item.price * c.quantity, 0),

    getQuantity: (itemId) => {
        const found = get().items.find((c) => c.item.id === itemId);
        return found ? found.quantity : 0;
    },
}));
