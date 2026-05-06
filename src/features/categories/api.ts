import { apiClient } from "../../services/api-client";
import { ApiEnvelope, Category, CategoryInput } from "../../services/types";

export async function listCategories() {
  const response = await apiClient.get<ApiEnvelope<Category[]>>("/categories");
  return response.data.data;
}

export async function createCategory(input: CategoryInput) {
  const response = await apiClient.post<ApiEnvelope<Category>>("/categories", input);
  return response.data.data;
}

export async function updateCategory(id: string, input: CategoryInput) {
  const response = await apiClient.patch<ApiEnvelope<Category>>(`/categories/${id}`, input);
  return response.data.data;
}

export async function deleteCategory(id: string) {
  await apiClient.delete(`/categories/${id}`);
}
