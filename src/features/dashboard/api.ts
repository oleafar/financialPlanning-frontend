import { apiClient } from "../../services/api-client";
import {
  ApiEnvelope,
  CategoryReportItem,
  PeriodReportItem,
  ReportFilters,
  SummaryReport,
} from "../../services/types";
import {
  normalizeCategoryReport,
  normalizePeriodReport,
  normalizeSummaryReport,
} from "../../services/normalizers";

export const mapSummaryReport = normalizeSummaryReport;

export async function getSummaryReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<SummaryReport>>("/reports/summary", {
    params: filters,
  });

  return normalizeSummaryReport(response.data.data);
}

export async function getCategoryReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<CategoryReportItem[]>>("/reports/by-category", {
    params: filters,
  });
  return normalizeCategoryReport(response.data.data);
}

export async function getPeriodReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<PeriodReportItem[]>>("/reports/by-period", {
    params: filters,
  });
  return normalizePeriodReport(response.data.data);
}
