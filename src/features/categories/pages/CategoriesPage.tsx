import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, List, Popconfirm, Space, Tabs, Tag } from "antd";
import { useState } from "react";
import { AsyncContent } from "../../../components/AsyncContent";
import { AppEmptyState, AppEmptyStateAction } from "../../../components/AppEmptyState";
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  async function handleSubmit(values: CategoryInput) {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, input: values });
        feedback.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        feedback.success("Category created successfully");
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
      feedback.success("Category deleted successfully");
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  const categories = categoriesQuery.data || [];
  const incomeCategories = categories.filter((category) => category.type === "income");
  const expenseCategories = categories.filter((category) => category.type === "expense");

  function renderCategoryList(items: Category[]) {
    if (!items.length) {
      return (
        <AppEmptyState
          title="No categories in this group"
          description="Create a category to organize your transactions."
          action={
            <AppEmptyStateAction
              label="Create category"
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
                title="Delete this category?"
                description="This action cannot be undone."
                onConfirm={() => handleDelete(category.id)}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta title={category.name} description={<Tag>{category.type}</Tag>} />
          </List.Item>
        )}
      />
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageTitle
        title="Categories"
        subtitle="Separate income and expense categories for cleaner reporting."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
          >
            New category
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
              { key: "expense", label: `Expense (${expenseCategories.length})`, children: renderCategoryList(expenseCategories) },
              { key: "income", label: `Income (${incomeCategories.length})`, children: renderCategoryList(incomeCategories) },
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
