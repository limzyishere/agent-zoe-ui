import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api/contacts";

const key = (categoryId: number | null) => [
  "contacts",
  categoryId,
];

export function useContacts(categoryId: number | null) {
  return useQuery({
    queryKey: key(categoryId),
    queryFn: () => api.fetchContactsByCategory(categoryId!),
    enabled: Boolean(categoryId),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createContact,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => api.updateContact(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteContact,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
