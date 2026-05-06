import { Button, Form, Input, Space, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks";
import { useFeedback } from "../../../hooks/useFeedback";
import { LoginInput } from "../../../services/types";

export function LoginPage() {
  const [form] = Form.useForm<LoginInput>();
  const mutation = useLoginMutation();
  const feedback = useFeedback();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  async function handleSubmit(values: LoginInput) {
    try {
      await mutation.mutateAsync(values);
      feedback.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Typography.Title level={3}>Login</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password placeholder="Your password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
          Sign in
        </Button>
      </Form>
      <Typography.Text type="secondary">
        No account yet? <Link to="/register">Create one</Link>
      </Typography.Text>
    </Space>
  );
}
