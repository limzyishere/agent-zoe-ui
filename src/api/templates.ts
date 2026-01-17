import { apiFetch } from "./apiFetch";

export type Template = {
  id: number;
  name: string;
  content: string;
};

export function fetchTemplates(): Promise<Template[]> {
  return apiFetch("/property/v1/templates");
}

export function createTemplate(data: {
  name: string;
  content: string;
}): Promise<Template> {
  return apiFetch("/property/v1/template", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTemplate(
  id: number,
  data: { name?: string; content?: string }
): Promise<Template> {
  return apiFetch(`/property/v1/template/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteTemplate(id: number) {
  return apiFetch(`/property/v1/template/${id}`, {
    method: "DELETE",
  });
}
