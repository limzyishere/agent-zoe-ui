import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api/contacts";

const key = (category: string) => ["contacts", category];

export function useContacts(category: string) {
  return useQuery({
    queryKey: key(category),
    queryFn: () => api.fetchContactsByCategory(category),
    enabled: Boolean(category), // 🔒 auth-safe
  });
}

export function useCreateContact(category: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createContact,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key(category) });
    },
  });
}

export function useUpdateContact(category: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.updateContact(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key(category) });
    },
  });
}

export function useDeleteContact(category: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteContact,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key(category) });
    },
  });
}
