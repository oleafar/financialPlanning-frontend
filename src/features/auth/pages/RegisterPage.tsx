import { Button, Form, Input, Space, Typography } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../hooks";
import { useFeedback } from "../../../hooks/useFeedback";
import { RegisterInput } from "../../../services/types";
import { useAuthSession } from "../../../hooks/useAuthSession";

export function RegisterPage() {
  const [form] = Form.useForm<RegisterInput>();
  const mutation = useRegisterMutation();
  const feedback = useFeedback();
  const navigate = useNavigate();
  const session = useAuthSession();

  if (session.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(values: RegisterInput) {
    try {
      await mutation.mutateAsync(values);
      feedback.success("Conta criada com sucesso");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      feedback.error(error as { message: string });
    }
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
      <Typography.Title level={3}>Criar conta</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, min: 2 }]}
        >
          <Input placeholder="Seu nome" />
        </Form.Item>
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
          <Input.Password placeholder="Pelo menos 6 caracteres" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={mutation.isPending}
        >
          Cadastrar
        </Button>
      </Form>
      <Typography.Text type="secondary">
        Ja possui conta? <Link to="/login">Entrar</Link>
      </Typography.Text>
    </Space>
  );
}
