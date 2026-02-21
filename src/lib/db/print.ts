import { supabase } from '../supabase';
import { PrintRequest, PrintStatus } from '../types/database.types';

export async function createPrintRequest(request: Omit<PrintRequest, 'id' | 'created_at' | 'status' | 'pickup_code'>): Promise<PrintRequest> {
    const { data, error } = await supabase
        .from('print_requests')
        .insert({ ...request, status: 'pending' })
        .select()
        .single();
    if (error) throw error;
    return data as PrintRequest;
}

export async function getUserPrintRequests(userId: string): Promise<PrintRequest[]> {
    const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as PrintRequest[];
}

export async function getPrintRequestById(id: string): Promise<PrintRequest | null> {
    const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as PrintRequest | null;
}
