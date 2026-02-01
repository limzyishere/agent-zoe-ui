import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api/categories";

/* -----------------------------
 * Queries
 * ----------------------------- */

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });
}

/* -----------------------------
 * Mutations
 * ----------------------------- */

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
    }: {
      id: number;
      name: string;
    }) => api.updateCategory(id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
