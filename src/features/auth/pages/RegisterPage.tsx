import { Button, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../hooks";
import { useFeedback } from "../../../hooks/useFeedback";
import { RegisterInput } from "../../../services/types";

export function RegisterPage() {
  const [form] = Form.useForm<RegisterInput>();
  const mutation = useRegisterMutation();
  const feedback = useFeedback();
  const navigate = useNavigate();

  async function handleSubmit(values: RegisterInput) {
    try {
      await mutation.mutateAsync(values);
      feedback.success("Account created successfully");
      navigate("/", { replace: true });
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Typography.Title level={3}>Create account</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password placeholder="At least 6 characters" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
          Register
        </Button>
      </Form>
      <Typography.Text type="secondary">
        Already have an account? <Link to="/login">Sign in</Link>
      </Typography.Text>
    </Space>
  );
}
