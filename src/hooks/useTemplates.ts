import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api/templates";

const KEY = ["templates"];

export function useTemplates() {
  return useQuery({
    queryKey: KEY,
    queryFn: api.fetchTemplates,
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.updateTemplate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
