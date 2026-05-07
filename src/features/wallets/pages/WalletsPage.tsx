import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import { AsyncContent } from "../../../components/AsyncContent";
import { AppEmptyState, AppEmptyStateAction } from "../../../components/AppEmptyState";
import { PageTitle } from "../../../components/PageTitle";
import { useFeedback } from "../../../hooks/useFeedback";
import { Wallet, WalletInput } from "../../../services/types";
import { formatCurrency } from "../../../utils/currency";
import {
  useCreateWalletMutation,
  useDeleteWalletMutation,
  useUpdateWalletMutation,
  useWalletsQuery,
} from "../hooks";
import { WalletFormModal } from "../components/WalletFormModal";

export function WalletsPage() {
  const walletsQuery = useWalletsQuery();
  const createMutation = useCreateWalletMutation();
  const updateMutation = useUpdateWalletMutation();
  const deleteMutation = useDeleteWalletMutation();
  const feedback = useFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  async function handleSubmit(values: WalletInput) {
    try {
      if (selectedWallet) {
        await updateMutation.mutateAsync({ id: selectedWallet.id, input: values });
        feedback.success("Carteira atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(values);
        feedback.success("Carteira criada com sucesso");
      }

      setSelectedWallet(null);
      setIsModalOpen(false);
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  async function handleDelete(walletId: string) {
    try {
      await deleteMutation.mutateAsync(walletId);
      feedback.success("Carteira excluida com sucesso");
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  const wallets = Array.isArray(walletsQuery.data) ? walletsQuery.data : [];

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageTitle
        title="Carteiras"
        subtitle="Gerencie os locais onde seu dinheiro esta."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedWallet(null);
              setIsModalOpen(true);
            }}
          >
            Nova carteira
          </Button>
        }
      />
      <Card>
        <AsyncContent
          isLoading={walletsQuery.isLoading}
          error={walletsQuery.error?.message || null}
        >
          {wallets.length ? (
            <Table
              dataSource={wallets}
              rowKey="id"
              pagination={false}
              columns={[
                { title: "Nome", dataIndex: "name" },
                {
                  title: "Tipo",
                  dataIndex: "type",
                  render: (type: Wallet["type"]) =>
                    <Tag>{type === "bank" ? "Banco" : type === "cash" ? "Dinheiro" : type === "digital" ? "Digital" : "Outro"}</Tag>,
                },
                {
                  title: "Saldo",
                  dataIndex: "balance",
                  align: "right",
                  render: (value: number) => formatCurrency(value),
                },
                {
                  title: "Acoes",
                  key: "actions",
                  align: "right",
                  render: (_, wallet) => (
                    <Flex justify="flex-end" gap={8}>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setIsModalOpen(true);
                        }}
                      />
                      <Popconfirm
                        title="Excluir esta carteira?"
                        description="Esta acao nao pode ser desfeita."
                        onConfirm={() => handleDelete(wallet.id)}
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
              title="Nenhuma carteira ainda"
              description="Crie sua primeira carteira para comecar a acompanhar saldos e transacoes."
              action={
                <AppEmptyStateAction
                  label="Criar carteira"
                  onClick={() => {
                    setSelectedWallet(null);
                    setIsModalOpen(true);
                  }}
                />
              }
            />
          )}
        </AsyncContent>
      </Card>
      <WalletFormModal
        open={isModalOpen}
        initialValues={selectedWallet}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedWallet(null);
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
