import { Form, Input, Modal, Select } from "antd";
import {
  Category,
  CategoryInput,
  TransactionType,
} from "../../../services/types";

const typeOptions: Array<{ label: string; value: TransactionType }> = [
  { label: "Receita", value: "income" },
  { label: "Despesa", value: "expense" },
];

type CategoryFormModalProps = {
  open: boolean;
  initialValues?: Category | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: CategoryInput) => void;
};

export function CategoryFormModal({
  open,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: CategoryFormModalProps) {
  const [form] = Form.useForm<CategoryInput>();

  return (
    <Modal
      open={open}
      title={initialValues ? "Editar categoria" : "Nova categoria"}
      okText={initialValues ? "Salvar alteracoes" : "Criar categoria"}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          form.setFieldsValue(
            initialValues
              ? { name: initialValues.name, type: initialValues.type }
              : { name: "", type: "expense" },
          );
        } else {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, min: 2 }]}
        >
          <Input placeholder="Alimentacao, Salario, Transporte..." />
        </Form.Item>
        <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
          <Select options={typeOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
