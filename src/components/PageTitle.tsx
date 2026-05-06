import { Space, Typography } from "antd";
import { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
};

export function PageTitle({ title, subtitle, extra }: PageTitleProps) {
  return (
    <div className="page-title">
      <Space direction="vertical" size={4}>
        <Typography.Title level={2}>{title}</Typography.Title>
        {subtitle ? <Typography.Text type="secondary">{subtitle}</Typography.Text> : null}
      </Space>
      {extra}
    </div>
  );
}
