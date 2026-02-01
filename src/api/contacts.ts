import { apiFetch } from "./apiFetch";

export type Category = {
  id: number;
  name: string;
};

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  propertyInterest?: string | null;
  category: Category;
};

export function fetchContactsByCategory(
  categoryId: number
): Promise<Contact[]> {
  const params = new URLSearchParams({
    category_id: String(categoryId),
  });

  return apiFetch(`/property/v1/contacts?${params}`);
}

export function createContact(data: {
  name: string;
  phone: string;
  email?: string;
  propertyInterest?: string;
  category_id: number;
}): Promise<Contact> {
  return apiFetch("/property/v1/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateContact(
  id: number,
  data: Partial<{
    name: string;
    phone: string;
    email?: string;
    propertyInterest?: string;
    category_id: number;
  }>
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
