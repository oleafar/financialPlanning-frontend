import { Button, Form, Input, Space, Typography } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks";
import { useFeedback } from "../../../hooks/useFeedback";
import { LoginInput } from "../../../services/types";
import { useAuthSession } from "../../../hooks/useAuthSession";

export function LoginPage() {
  const [form] = Form.useForm<LoginInput>();
  const mutation = useLoginMutation();
  const feedback = useFeedback();
  const navigate = useNavigate();
  const session = useAuthSession();

  if (session.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(values: LoginInput) {
    try {
      await mutation.mutateAsync(values);
      feedback.success("Login realizado com sucesso");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
      <Typography.Title level={3}>Entrar</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password placeholder="Sua senha" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={mutation.isPending}
        >
          Entrar
        </Button>
      </Form>
      <Typography.Text type="secondary">
        Ainda nao tem conta? <Link to="/register">Criar conta</Link>
      </Typography.Text>
    </Space>
  );
}
