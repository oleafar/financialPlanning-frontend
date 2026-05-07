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
        feedback.success("Transacao atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(values);
        feedback.success("Transacao criada com sucesso");
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
      feedback.success("Transacao excluida com sucesso");
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
        title="Transacoes"
        subtitle="Acompanhe receitas e despesas com uma tabela simples e rapida."
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
            Nova transacao
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
            placeholder="Tipo"
            style={{ width: 140 }}
            options={[
              { label: "Receita", value: "income" },
              { label: "Despesa", value: "expense" },
            ]}
            onChange={(value) => setFilters((current) => ({ ...current, page: 1, type: value }))}
          />
          <Select
            allowClear
            placeholder="Categoria"
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
            placeholder="Buscar por titulo"
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
                { title: "Titulo", dataIndex: "title" },
                {
                  title: "Tipo",
                  dataIndex: "type",
                  render: (value: Transaction["type"]) => (value === "income" ? "Receita" : "Despesa"),
                },
                {
                  title: "Categoria",
                  render: (_, transaction) => transaction.category?.name || "Sem categoria",
                },
                {
                  title: "Carteira",
                  render: (_, transaction) => transaction.wallet?.name || "Carteira desconhecida",
                },
                {
                  title: "Data",
                  dataIndex: "date",
                  render: (value: string) => formatDate(value),
                },
                {
                  title: "Valor",
                  dataIndex: "amount",
                  align: "right",
                  render: (value: number, transaction: Transaction) =>
                    `${transaction.type === "expense" ? "-" : "+"} ${formatCurrency(value)}`,
                },
                {
                  title: "Acoes",
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
                        title="Excluir esta transacao?"
                        description="Esta acao nao pode ser desfeita."
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
              title="Nenhuma transacao encontrada"
              description={
                categories.length && wallets.length
                  ? "Crie sua primeira transacao ou ajuste os filtros atuais."
                  : "Crie carteiras e categorias primeiro para registrar transacoes."
              }
              action={
                categories.length && wallets.length ? (
                  <AppEmptyStateAction
                    label="Criar transacao"
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
