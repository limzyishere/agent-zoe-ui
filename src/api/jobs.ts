import { apiFetch } from "./apiFetch";

export function createJob(data: {
  message: string;
  contact_ids: number[];
}) {
  return apiFetch("/property/v1/job", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export type Job = {
  id: number;
  status: string;
  message: string;
  contacts: any;
  created_at: string;
};

export function fetchJobs(status?: string): Promise<Job[]> {
  const params = status
    ? `?status=${encodeURIComponent(status)}`
    : "";
  return apiFetch(`/property/v1/jobs${params}`);
}

export function deleteJob(id: number) {
  return apiFetch(`/property/v1/job/${id}`, {
    method: "DELETE",
  });
}
