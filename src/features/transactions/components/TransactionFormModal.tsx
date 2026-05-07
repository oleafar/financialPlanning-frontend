import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { Category, Transaction, TransactionInput, Wallet } from "../../../services/types";
import { toIsoDate } from "../../../utils/date";

type TransactionFormValues = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: dayjs.Dayjs;
  categoryId: string;
  walletId: string;
};

type TransactionFormModalProps = {
  open: boolean;
  initialValues?: Transaction | null;
  wallets: Wallet[];
  categories: Category[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: TransactionInput) => void;
};

export function TransactionFormModal({
  open,
  initialValues,
  wallets,
  categories,
  confirmLoading,
  onCancel,
  onSubmit,
}: TransactionFormModalProps) {
  const [form] = Form.useForm<TransactionFormValues>();
  const selectedType = Form.useWatch("type", form);
  const filteredCategories = categories.filter((category) =>
    selectedType ? category.type === selectedType : true,
  );

  return (
    <Modal
      open={open}
      title={initialValues ? "Editar transacao" : "Nova transacao"}
      okText={initialValues ? "Salvar alteracoes" : "Criar transacao"}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          form.setFieldsValue(
            initialValues
              ? {
                  title: initialValues.title,
                  amount: initialValues.amount,
                  type: initialValues.type,
                  date: dayjs(initialValues.date),
                  categoryId: initialValues.categoryId,
                  walletId: initialValues.walletId,
                }
              : {
                  title: "",
                  amount: 0,
                  type: "expense",
                  date: dayjs(),
                },
          );
        } else {
          form.resetFields();
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) =>
          onSubmit({
            title: values.title,
            amount: values.amount,
            type: values.type,
            date: toIsoDate(values.date) || dayjs().toISOString(),
            categoryId: values.categoryId,
            walletId: values.walletId,
          })
        }
      >
        <Form.Item label="Titulo" name="title" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="Mercado, Salario..." />
        </Form.Item>
        <Form.Item label="Valor" name="amount" rules={[{ required: true }]}>
          <InputNumber min={0.01} precision={2} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Despesa", value: "expense" },
              { label: "Receita", value: "income" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Data" name="date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Carteira" name="walletId" rules={[{ required: true }]}>
          <Select options={wallets.map((wallet) => ({ label: wallet.name, value: wallet.id }))} />
        </Form.Item>
        <Form.Item label="Categoria" name="categoryId" rules={[{ required: true }]}>
          <Select
            options={filteredCategories.map((category) => ({
              label: `${category.name} (${category.type === "income" ? "receita" : "despesa"})`,
              value: category.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
