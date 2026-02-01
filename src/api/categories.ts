import { apiFetch } from "./apiFetch";

/* -----------------------------
 * Types
 * ----------------------------- */
export type Category = {
  id: number;
  name: string;
};

/* -----------------------------
 * API calls
 * ----------------------------- */

/**
 * GET /property/v1/category
 */
export function fetchCategories(): Promise<Category[]> {
  return apiFetch("/property/v1/category");
}

/**
 * POST /property/v1/category
 */
export function createCategory(data: {
  name: string;
}): Promise<Category> {
  return apiFetch("/property/v1/category", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT /property/v1/category/:id
 */
export function updateCategory(
  id: number,
  data: { name: string }
): Promise<Category> {
  return apiFetch(`/property/v1/category/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
