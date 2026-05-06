import { apiClient } from "../../services/api-client";
import {
  ApiEnvelope,
  CategoryReportItem,
  PeriodReportItem,
  ReportFilters,
  SummaryReport,
} from "../../services/types";

type BackendSummaryReport = {
  totalBalance: number;
  income: number;
  expense: number;
  net: number;
  wallets: SummaryReport["wallets"];
};

export function mapSummaryReport(data: BackendSummaryReport): SummaryReport {
  return {
    totalBalance: data.totalBalance,
    totalIncome: data.income,
    totalExpense: data.expense,
    net: data.net,
    wallets: data.wallets,
  };
}

export async function getSummaryReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<BackendSummaryReport>>("/reports/summary", {
    params: filters,
  });

  return mapSummaryReport(response.data.data);
}

export async function getCategoryReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<CategoryReportItem[]>>("/reports/by-category", {
    params: filters,
  });
  return response.data.data;
}

export async function getPeriodReport(filters: ReportFilters) {
  const response = await apiClient.get<ApiEnvelope<PeriodReportItem[]>>("/reports/by-period", {
    params: filters,
  });
  return response.data.data;
}
