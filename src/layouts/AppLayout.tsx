import {
  AppstoreOutlined,
  LogoutOutlined,
  ProfileOutlined,
  TagsOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../services/session";
import { notifySessionChange } from "../hooks/useAuthSession";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/dashboard", icon: <AppstoreOutlined />, label: "Painel" },
  { key: "/transactions", icon: <ProfileOutlined />, label: "Transacoes" },
  { key: "/wallets", icon: <WalletOutlined />, label: "Carteiras" },
  { key: "/categories", icon: <TagsOutlined />, label: "Categorias" },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key || "/dashboard";

  function handleLogout() {
    clearToken();
    notifySessionChange();
    navigate("/login", { replace: true });
  }

  return (
    <Layout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth="0" width={248} theme="light">
        <div className="brand-block">
          <Typography.Title level={4}>Financial Planning</Typography.Title>
          <Typography.Text type="secondary">Controle simples para as financas do dia a dia.</Typography.Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space>
            <Typography.Text strong>Gerenciador Financeiro Pessoal</Typography.Text>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Sair
          </Button>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
