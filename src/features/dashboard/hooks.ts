import { useQuery } from "@tanstack/react-query";
import { getCategoryReport, getPeriodReport, getSummaryReport } from "./api";
import { queryKeys } from "../../services/query-keys";
import { ReportFilters } from "../../services/types";
import { toQueryKeyPart } from "../../utils/query";

export function useSummaryReportQuery(filters: ReportFilters) {
  const keyPart = toQueryKeyPart(filters);
  return useQuery({
    queryKey: queryKeys.summaryReport(keyPart),
    queryFn: () => getSummaryReport(filters),
  });
}

export function useCategoryReportQuery(filters: ReportFilters) {
  const keyPart = toQueryKeyPart(filters);
  return useQuery({
    queryKey: queryKeys.categoryReport(keyPart),
    queryFn: () => getCategoryReport(filters),
  });
}

export function usePeriodReportQuery(filters: ReportFilters) {
  const keyPart = toQueryKeyPart(filters);
  return useQuery({
    queryKey: ["reports", "by-period", keyPart],
    queryFn: () => getPeriodReport(filters),
  });
}
