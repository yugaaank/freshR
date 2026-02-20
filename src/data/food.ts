export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    isVeg: boolean;
    isBestseller: boolean;
    rating: number;
    prepTime: number;
}

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    image: string;
    isOpen: boolean;
    tag?: string;
    menu: MenuItem[];
}

export const foodCategories = [
    { id: 'c1', name: 'All', icon: '🍽️' },
    { id: 'c2', name: 'Meals', icon: '🍱' },
    { id: 'c3', name: 'Snacks', icon: '🍟' },
    { id: 'c4', name: 'Beverages', icon: '🧃' },
    { id: 'c5', name: 'Desserts', icon: '🍰' },
    { id: 'c6', name: 'Healthy', icon: '🥗' },
    { id: 'c7', name: 'Fast Food', icon: '🍔' },
];

export const restaurants: Restaurant[] = [
    {
        id: 'r1',
        name: 'Canteen Central',
        cuisine: 'North Indian · South Indian',
        rating: 4.2,
        deliveryTime: '15–20 min',
        deliveryFee: 0,
        minOrder: 50,
        image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400',
        isOpen: true,
        tag: 'Today\'s special 🔥',
        menu: [
            {
                id: 'm1',
                name: 'Rajma Chawal',
                description: 'Served with chawal, salad, and papad',
                price: 70,
                originalPrice: 90,
                category: 'Meals',
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300',
                isVeg: true,
                isBestseller: true,
                rating: 4.5,
                prepTime: 12,
            },
            {
                id: 'm2',
                name: 'Paneer Butter Masala + Roti',
                description: '2 rotis, rich tomato-based gravy',
                price: 95,
                category: 'Meals',
                image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.3,
                prepTime: 15,
            },
            {
                id: 'm3',
                name: 'Chicken Biryani',
                description: 'Dum biryani with raita and salan',
                price: 130,
                category: 'Meals',
                image: 'https://images.unsplash.com/photo-1563379091339-03246963d03f?w=300',
                isVeg: false,
                isBestseller: true,
                rating: 4.7,
                prepTime: 20,
            },
            {
                id: 'm4',
                name: 'Masala Chai',
                description: 'Ginger, cardamom, strong brew',
                price: 15,
                category: 'Beverages',
                image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.1,
                prepTime: 5,
            },
            {
                id: 'm5',
                name: 'Cold Coffee',
                description: 'Thick, creamy cafe-style cold coffee',
                price: 45,
                category: 'Beverages',
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
                isVeg: true,
                isBestseller: true,
                rating: 4.4,
                prepTime: 7,
            },
            {
                id: 'm6',
                name: 'Samosa (2 pcs)',
                description: 'Crispy aloo samosa with green chutney',
                price: 20,
                category: 'Snacks',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.0,
                prepTime: 8,
            },
        ],
    },
    {
        id: 'r2',
        name: 'Burger Shed',
        cuisine: 'Fast Food · American',
        rating: 4.5,
        deliveryTime: '10–15 min',
        deliveryFee: 10,
        minOrder: 80,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isOpen: true,
        tag: '⚡ 10 min delivery',
        menu: [
            {
                id: 'm7',
                name: 'Smoky BBQ Burger',
                description: 'Double patty, smoked BBQ sauce, caramelized onions',
                price: 149,
                originalPrice: 179,
                category: 'Fast Food',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
                isVeg: false,
                isBestseller: true,
                rating: 4.6,
                prepTime: 10,
            },
            {
                id: 'm8',
                name: 'Crispy Veg Burger',
                description: 'Crispy veg patty, coleslaw, special sauce',
                price: 99,
                category: 'Fast Food',
                image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.2,
                prepTime: 8,
            },
            {
                id: 'm9',
                name: 'Loaded Cheese Fries',
                description: 'Seasoned fries, melted cheddar, jalapenos',
                price: 79,
                category: 'Snacks',
                image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
                isVeg: true,
                isBestseller: true,
                rating: 4.5,
                prepTime: 6,
            },
            {
                id: 'm10',
                name: 'Oreo Shake',
                description: 'Thick blended milkshake with Oreo crumble',
                price: 89,
                category: 'Beverages',
                image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.4,
                prepTime: 5,
            },
        ],
    },
    {
        id: 'r3',
        name: 'Fresh Greens',
        cuisine: 'Healthy · Salads · Bowls',
        rating: 4.3,
        deliveryTime: '12–18 min',
        deliveryFee: 0,
        minOrder: 120,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        isOpen: true,
        tag: '🌿 New on FreshR',
        menu: [
            {
                id: 'm11',
                name: 'Caesar Salad Bowl',
                description: 'Romaine, parmesan, croutons, Caesar dressing',
                price: 149,
                category: 'Healthy',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
                isVeg: true,
                isBestseller: true,
                rating: 4.4,
                prepTime: 5,
            },
            {
                id: 'm12',
                name: 'Acai Smoothie Bowl',
                description: 'Frozen acai, granola, banana, mixed berries',
                price: 179,
                category: 'Healthy',
                image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300',
                isVeg: true,
                isBestseller: false,
                rating: 4.6,
                prepTime: 8,
            },
        ],
    },
];
