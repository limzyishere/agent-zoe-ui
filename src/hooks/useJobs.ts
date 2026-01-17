import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchJobs, deleteJob } from "../api/jobs";
import type { JobStatus } from "../api/jobs";

export function useJobs(status: JobStatus) {
  return useQuery({
    queryKey: ["jobs", status],
    queryFn: () => fetchJobs(status),
  });
}


export function useDeleteJob(status: JobStatus) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["jobs", status],
      });
    },
  });
}
