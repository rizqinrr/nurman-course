import type {
  CatalogCourseDetailDto,
  CatalogCourseDto,
  CatalogLessonListResponse,
  CatalogPathResponse,
  LibraryCourseDto,
  MyLessonProgressDto,
  ReaderLessonDto,
} from "@nurman-course/shared";
import { apiFetch, apiFetchPrivate, buildQuery } from "@/lib/api";

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CatalogResponse {
  data: CatalogCourseDto[];
  pagination: Pagination;
}

export interface LibraryResponse {
  data: LibraryCourseDto[];
  pagination: Pagination;
}

export interface CatalogFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  accessTier?: "free" | "paid";
}

export function getCatalog(filters: CatalogFilters = {}) {
  return apiFetch<CatalogResponse>(`/api/catalog/courses${buildQuery({ ...filters })}`);
}

export function getLessonCatalog(filters: Omit<CatalogFilters, "category" | "accessTier"> & { category?: string[] } = {}) {
  const query = { ...filters, category: Array.isArray(filters.category) ? filters.category.join(",") : filters.category };
  return apiFetch<CatalogLessonListResponse>(`/api/catalog/lessons${buildQuery(query)}`);
}

export function getCoursePaths() {
  return apiFetch<CatalogPathResponse>("/api/catalog/paths");
}

export function getMyLessonProgress() {
  return apiFetchPrivate<{ data: MyLessonProgressDto }>("/api/me/lesson-progress");
}

export function getCourseDetail(slug: string) {
  return apiFetch<{ data: CatalogCourseDetailDto }>(`/api/catalog/courses/${encodeURIComponent(slug)}`);
}

export function getReaderLesson(slug: string) {
  return apiFetchPrivate<{ data: ReaderLessonDto }>(`/api/reader/lessons/${encodeURIComponent(slug)}`);
}

export function getLibrary(filters: CatalogFilters = {}) {
  return apiFetchPrivate<LibraryResponse>(`/api/me/courses${buildQuery({ ...filters })}`);
}

export function updateLessonProgress(slug: string, completed: boolean) {
  return apiFetchPrivate(`/api/me/lessons/${encodeURIComponent(slug)}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

export function formatCoursePrice(price: number | null): string {
  if (price === null) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
