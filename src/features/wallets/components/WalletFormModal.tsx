import { Form, Input, InputNumber, Modal, Select } from "antd";
import { Wallet, WalletInput, WalletType } from "../../../services/types";

const walletTypeOptions: Array<{ label: string; value: WalletType }> = [
  { label: "Banco", value: "bank" },
  { label: "Dinheiro", value: "cash" },
  { label: "Digital", value: "digital" },
  { label: "Outro", value: "other" },
];

type WalletFormModalProps = {
  open: boolean;
  initialValues?: Wallet | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: WalletInput) => void;
};

export function WalletFormModal({
  open,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: WalletFormModalProps) {
  const [form] = Form.useForm<WalletInput>();

  return (
    <Modal
      open={open}
      title={initialValues ? "Editar carteira" : "Nova carteira"}
      okText={initialValues ? "Salvar alteracoes" : "Criar carteira"}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          form.setFieldsValue(
            initialValues
              ? { name: initialValues.name, type: initialValues.type, balance: initialValues.balance }
              : { name: "", type: "bank", balance: 0 },
          );
        } else {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Nome" name="name" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="Conta principal" />
        </Form.Item>
        <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
          <Select options={walletTypeOptions} />
        </Form.Item>
        <Form.Item label="Saldo inicial" name="balance">
          <InputNumber min={0} precision={2} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
