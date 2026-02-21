import { useQuery } from '@tanstack/react-query';
import { getMenuCategories, getMenuItems, getRestaurants, searchMenuItems } from '../lib/db/food';

export const foodKeys = {
    restaurants: ['restaurants'] as const,
    menu: (rid: string) => ['menu', rid] as const,
    categories: (rid: string) => ['menu', 'cats', rid] as const,
    search: (q: string) => ['menu', 'search', q] as const,
};

export function useRestaurants() {
    return useQuery({
        queryKey: foodKeys.restaurants,
        queryFn: getRestaurants,
        staleTime: 5 * 60_000, // restaurants rarely change
    });
}

export function useMenuItems(restaurantId?: string, category?: string) {
    return useQuery({
        queryKey: [...(restaurantId ? foodKeys.menu(restaurantId) : ['menu', 'all']), category],
        queryFn: () => getMenuItems(restaurantId || '', category),
        staleTime: 2 * 60_000,
    });
}

export function useMenuCategories(restaurantId: string) {
    return useQuery({
        queryKey: foodKeys.categories(restaurantId),
        queryFn: () => getMenuCategories(restaurantId),
        enabled: !!restaurantId,
        staleTime: 10 * 60_000,
    });
}

export function useMenuSearch(query: string) {
    return useQuery({
        queryKey: foodKeys.search(query),
        queryFn: () => searchMenuItems(query),
        enabled: query.trim().length > 1,
        staleTime: 30_000,
    });
}
