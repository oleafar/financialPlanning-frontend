import { Form, Input, InputNumber, Modal, Select } from "antd";
import { Wallet, WalletInput, WalletType } from "../../../services/types";

const walletTypeOptions: Array<{ label: string; value: WalletType }> = [
  { label: "Bank", value: "bank" },
  { label: "Cash", value: "cash" },
  { label: "Digital", value: "digital" },
  { label: "Other", value: "other" },
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
      title={initialValues ? "Edit wallet" : "New wallet"}
      okText={initialValues ? "Save changes" : "Create wallet"}
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
        <Form.Item label="Name" name="name" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="Main bank account" />
        </Form.Item>
        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select options={walletTypeOptions} />
        </Form.Item>
        <Form.Item label="Initial balance" name="balance">
          <InputNumber min={0} precision={2} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
