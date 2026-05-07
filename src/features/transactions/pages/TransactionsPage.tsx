import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { useState } from "react";
import { AsyncContent } from "../../../components/AsyncContent";
import { AppEmptyState, AppEmptyStateAction } from "../../../components/AppEmptyState";
import { PageTitle } from "../../../components/PageTitle";
import { useFeedback } from "../../../hooks/useFeedback";
import { Category, Transaction, TransactionFilters, TransactionInput } from "../../../services/types";
import { formatCurrency } from "../../../utils/currency";
import { formatDate, toIsoDate } from "../../../utils/date";
import { useCategoriesQuery } from "../../categories/hooks";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from "../hooks";
import { TransactionFormModal } from "../components/TransactionFormModal";
import { useWalletsQuery } from "../../wallets/hooks";

const { RangePicker } = DatePicker;

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({
    order: "desc",
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const transactionsQuery = useTransactionsQuery(filters);
  const categoriesQuery = useCategoriesQuery();
  const walletsQuery = useWalletsQuery();
  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const feedback = useFeedback();

  const transactionsData = transactionsQuery.data;
  const categories = Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [];
  const wallets = Array.isArray(walletsQuery.data) ? walletsQuery.data : [];
  const searchTerm = search.trim().toLowerCase();
  const filteredItems =
    transactionsData?.items.filter((transaction) =>
      transaction.title.toLowerCase().includes(searchTerm),
    ) || [];

  async function handleSubmit(values: TransactionInput) {
    try {
      if (selectedTransaction) {
        await updateMutation.mutateAsync({ id: selectedTransaction.id, input: values });
        feedback.success("Transaction updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        feedback.success("Transaction created successfully");
      }

      setSelectedTransaction(null);
      setIsModalOpen(false);
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  async function handleDelete(transactionId: string) {
    try {
      await deleteMutation.mutateAsync(transactionId);
      feedback.success("Transaction deleted successfully");
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  const totalForPagination =
    (transactionsData?.page || 1) * (transactionsData?.pageSize || filters.pageSize || 10) +
    (transactionsData?.items.length === (transactionsData?.pageSize || filters.pageSize || 10)
      ? transactionsData?.pageSize || filters.pageSize || 10
      : 0);

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageTitle
        title="Transactions"
        subtitle="Track income and expenses with simple, fast table workflows."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedTransaction(null);
              setIsModalOpen(true);
            }}
            disabled={!categories.length || !wallets.length}
          >
            New transaction
          </Button>
        }
      />
      <Card>
        <Space wrap size={16} style={{ marginBottom: 16 }}>
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) =>
              setFilters((current) => ({
                ...current,
                page: 1,
                startDate: toIsoDate(dates?.[0]),
                endDate: toIsoDate(dates?.[1], true),
              }))
            }
          />
          <Select
            allowClear
            placeholder="Type"
            style={{ width: 140 }}
            options={[
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ]}
            onChange={(value) => setFilters((current) => ({ ...current, page: 1, type: value }))}
          />
          <Select
            allowClear
            placeholder="Category"
            style={{ width: 220 }}
            options={categories.map((category: Category) => ({
              label: category.name,
              value: category.id,
            }))}
            onChange={(value) =>
              setFilters((current) => ({ ...current, page: 1, categoryId: value }))
            }
          />
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by title"
            style={{ width: 240 }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Space>
        <AsyncContent
          isLoading={
            transactionsQuery.isLoading || categoriesQuery.isLoading || walletsQuery.isLoading
          }
          error={
            transactionsQuery.error?.message ||
            categoriesQuery.error?.message ||
            walletsQuery.error?.message ||
            null
          }
        >
          {filteredItems.length ? (
            <Table
              rowKey="id"
              dataSource={filteredItems}
              pagination={{
                current: transactionsData?.page || filters.page || 1,
                pageSize: transactionsData?.pageSize || filters.pageSize || 10,
                total: totalForPagination,
                onChange: (page, pageSize) =>
                  setFilters((current) => ({ ...current, page, pageSize })),
              }}
              columns={[
                { title: "Title", dataIndex: "title" },
                {
                  title: "Type",
                  dataIndex: "type",
                  render: (value: Transaction["type"]) => (value === "income" ? "Income" : "Expense"),
                },
                {
                  title: "Category",
                  render: (_, transaction) => transaction.category?.name || "Uncategorized",
                },
                {
                  title: "Wallet",
                  render: (_, transaction) => transaction.wallet?.name || "Unknown wallet",
                },
                {
                  title: "Date",
                  dataIndex: "date",
                  render: (value: string) => formatDate(value),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  align: "right",
                  render: (value: number, transaction: Transaction) =>
                    `${transaction.type === "expense" ? "-" : "+"} ${formatCurrency(value)}`,
                },
                {
                  title: "Actions",
                  key: "actions",
                  align: "right",
                  render: (_, transaction) => (
                    <Flex justify="flex-end" gap={8}>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsModalOpen(true);
                        }}
                      />
                      <Popconfirm
                        title="Delete this transaction?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(transaction.id)}
                      >
                        <Button danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Flex>
                  ),
                },
              ]}
            />
          ) : (
            <AppEmptyState
              title="No transactions found"
              description={
                categories.length && wallets.length
                  ? "Create your first transaction or adjust your current filters."
                  : "Create wallets and categories first so transactions can be recorded."
              }
              action={
                categories.length && wallets.length ? (
                  <AppEmptyStateAction
                    label="Create transaction"
                    onClick={() => {
                      setSelectedTransaction(null);
                      setIsModalOpen(true);
                    }}
                  />
                ) : undefined
              }
            />
          )}
        </AsyncContent>
      </Card>
      <TransactionFormModal
        open={isModalOpen}
        initialValues={selectedTransaction}
        wallets={wallets}
        categories={categories}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
