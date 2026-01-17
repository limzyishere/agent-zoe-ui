import { apiFetch } from "./apiFetch";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  category: string;
};

export function fetchContactsByCategory(category: string): Promise<Contact[]> {
  const params = new URLSearchParams({ category });
  return apiFetch(`/property/v1/contacts?${params.toString()}`);
}

export function createContact(data: Omit<Contact, "id">): Promise<Contact> {
  return apiFetch("/property/v1/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateContact(
  id: number,
  data: Partial<Omit<Contact, "id">>
): Promise<Contact> {
  return apiFetch(`/property/v1/contact/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteContact(id: number) {
  return apiFetch(`/property/v1/contact/${id}`, {
    method: "DELETE",
  });
}
