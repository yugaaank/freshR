import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPrintRequest, getUserPrintRequests, getPrintRequestById } from '../lib/db/print';

export const printKeys = {
    all: (uid: string) => ['print_requests', uid] as const,
    detail: (id: string) => ['print_requests', id] as const,
};

export function useCreatePrintRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPrintRequest,
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: printKeys.all(vars.user_id) });
        },
    });
}

export function useUserPrintRequests(userId: string | null) {
    return useQuery({
        queryKey: printKeys.all(userId ?? ''),
        queryFn: () => getUserPrintRequests(userId!),
        enabled: !!userId,
        staleTime: 60_000,
    });
}

export function usePrintRequest(id: string | null) {
    return useQuery({
        queryKey: printKeys.detail(id ?? ''),
        queryFn: () => getPrintRequestById(id!),
        enabled: !!id,
        staleTime: 30_000,
    });
}
