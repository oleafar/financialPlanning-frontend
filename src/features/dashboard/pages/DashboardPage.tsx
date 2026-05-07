import { DatePicker, Card, Col, List, Row, Space, Typography } from "antd";
import { Pie } from "@ant-design/plots";
import { useState } from "react";
import { AsyncContent } from "../../../components/AsyncContent";
import { AppEmptyState } from "../../../components/AppEmptyState";
import { PageTitle } from "../../../components/PageTitle";
import { SummaryStatCard } from "../../../components/SummaryStatCard";
import { formatCurrency } from "../../../utils/currency";
import { toIsoDate } from "../../../utils/date";
import { ReportFilters } from "../../../services/types";
import { useCategoryReportQuery, usePeriodReportQuery, useSummaryReportQuery } from "../hooks";

const { RangePicker } = DatePicker;

export function DashboardPage() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const summaryQuery = useSummaryReportQuery(filters);
  const categoryQuery = useCategoryReportQuery(filters);
  const periodQuery = usePeriodReportQuery(filters);

  const summary = summaryQuery.data;
  const wallets = summary?.wallets || [];
  const categoryItems = categoryQuery.data || [];
  const periodItems = periodQuery.data || [];
  const hasAnyData =
    wallets.length > 0 || categoryItems.length > 0 || periodItems.length > 0;

  const chartData =
    categoryItems
      .filter((item) => item.type === "expense")
      .map((item) => ({
        type: item.categoryName,
        value: item.total,
      })) || [];

  const fallbackChartData =
    chartData.length > 0
      ? chartData
      : categoryItems.map((item) => ({ type: item.categoryName, value: item.total }));

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageTitle
        title="Dashboard"
        subtitle="A fast overview of total balance, cash flow, and spending distribution."
        extra={
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) =>
              setFilters({
                startDate: toIsoDate(dates?.[0]),
                endDate: toIsoDate(dates?.[1], true),
              })
            }
          />
        }
      />
      <AsyncContent
        isLoading={summaryQuery.isLoading || categoryQuery.isLoading || periodQuery.isLoading}
        error={
          summaryQuery.error?.message || categoryQuery.error?.message || periodQuery.error?.message || null
        }
      >
        {summary && hasAnyData ? (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} xl={8}>
                <SummaryStatCard
                  title="Total balance"
                  value={formatCurrency(summary.totalBalance)}
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                <SummaryStatCard
                  title="Income"
                  value={formatCurrency(summary.totalIncome)}
                  tone="success"
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                <SummaryStatCard
                  title="Expense"
                  value={formatCurrency(summary.totalExpense)}
                  tone="danger"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={16}>
                <Card title="Spending by category">
                  {fallbackChartData.length ? (
                    <Pie
                      data={fallbackChartData}
                      angleField="value"
                      colorField="type"
                      label={{ text: "value" }}
                      legend={{ color: { title: false, position: "right" } }}
                    />
                  ) : (
                    <Typography.Text type="secondary">
                      No category data available for the selected period.
                    </Typography.Text>
                  )}
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card title="Wallet balances">
                  <List
                    dataSource={wallets}
                    renderItem={(wallet) => (
                      <List.Item>
                        <List.Item.Meta title={wallet.name} description={wallet.type} />
                        <Typography.Text strong>{formatCurrency(wallet.balance)}</Typography.Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <AppEmptyState
            title="No financial overview yet"
            description="Create wallets, categories, and transactions to populate your dashboard."
          />
        )}
      </AsyncContent>
    </Space>
  );
}
