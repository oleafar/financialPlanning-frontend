import { Card, Layout, Typography } from "antd";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Layout className="auth-layout">
      <Card className="auth-card">
        <Typography.Title level={2}>Financial Planning</Typography.Title>
        <Typography.Paragraph type="secondary">
          Personal finance control with a clear and direct daily workflow.
        </Typography.Paragraph>
        <Outlet />
      </Card>
    </Layout>
  );
}
