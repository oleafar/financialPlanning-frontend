import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, List, Popconfirm, Space, Tabs, Tag } from "antd";
import { useState } from "react";
import { AsyncContent } from "../../../components/AsyncContent";
import {
  AppEmptyState,
  AppEmptyStateAction,
} from "../../../components/AppEmptyState";
import { PageTitle } from "../../../components/PageTitle";
import { useFeedback } from "../../../hooks/useFeedback";
import { Category, CategoryInput } from "../../../services/types";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../hooks";
import { CategoryFormModal } from "../components/CategoryFormModal";

export function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const feedback = useFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  async function handleSubmit(values: CategoryInput) {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.id,
          input: values,
        });
        feedback.success("Categoria atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(values);
        feedback.success("Categoria criada com sucesso");
      }

      setSelectedCategory(null);
      setIsModalOpen(false);
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  async function handleDelete(categoryId: string) {
    try {
      await deleteMutation.mutateAsync(categoryId);
      feedback.success("Categoria excluida com sucesso");
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  const categories = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : [];
  const incomeCategories = categories.filter(
    (category) => category.type === "income",
  );
  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  function renderCategoryList(items: Category[]) {
    if (!items.length) {
      return (
        <AppEmptyState
          title="Nenhuma categoria neste grupo"
          description="Crie uma categoria para organizar suas transacoes."
          action={
            <AppEmptyStateAction
              label="Criar categoria"
              onClick={() => {
                setSelectedCategory(null);
                setIsModalOpen(true);
              }}
            />
          }
        />
      );
    }

    return (
      <List
        dataSource={items}
        renderItem={(category) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsModalOpen(true);
                }}
              />,
              <Popconfirm
                key="delete"
                title="Excluir esta categoria?"
                description="Esta acao nao pode ser desfeita."
                onConfirm={() => handleDelete(category.id)}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={category.name}
              description={<Tag>{category.type}</Tag>}
            />
          </List.Item>
        )}
      />
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
      <PageTitle
        title="Categorias"
        subtitle="Separe categorias de receita e despesa para relatórios mais claros."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
          >
            Nova categoria
          </Button>
        }
      />
      <Card>
        <AsyncContent
          isLoading={categoriesQuery.isLoading}
          error={categoriesQuery.error?.message || null}
        >
          <Tabs
            items={[
              {
                key: "expense",
                label: `Despesas (${expenseCategories.length})`,
                children: renderCategoryList(expenseCategories),
              },
              {
                key: "income",
                label: `Receitas (${incomeCategories.length})`,
                children: renderCategoryList(incomeCategories),
              },
            ]}
          />
        </AsyncContent>
      </Card>
      <CategoryFormModal
        open={isModalOpen}
        initialValues={selectedCategory}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
