import { supabase } from '../supabase';
import type { MenuItemRow, Restaurant } from '../types/database.types';

export type { MenuItemRow, Restaurant };

export async function getRestaurants(): Promise<Restaurant[]> {
    const { data, error } = await supabase
        .from('restaurants').select('*').order('rating', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Restaurant[];
}

export async function getMenuItems(restaurantId: string, category?: string): Promise<MenuItemRow[]> {
    let query = supabase.from('menu_items').select('*')
        .eq('restaurant_id', restaurantId).eq('is_available', true);
    if (category && category !== 'All') query = query.eq('category', category);
    const { data, error } = await query.order('is_popular', { ascending: false });
    if (error) throw error;
    return (data ?? []) as MenuItemRow[];
}

export async function searchMenuItems(query: string): Promise<MenuItemRow[]> {
    const { data, error } = await supabase
        .from('menu_items').select('*').eq('is_available', true).ilike('name', `%${query}%`);
    if (error) throw error;
    return (data ?? []) as MenuItemRow[];
}

export async function getMenuCategories(restaurantId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('menu_items').select('category').eq('restaurant_id', restaurantId).eq('is_available', true);
    if (error) throw error;
    const cats = [...new Set(((data ?? []) as any[]).map((r) => r.category as string))];
    return ['All', ...cats];
}
