import { Button, Empty } from "antd";
import { ReactNode } from "react";

type AppEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AppEmptyState({ title, description, action }: AppEmptyStateProps) {
  return (
    <Empty description={description}>
      <div className="empty-state">
        <strong>{title}</strong>
        {action ? <div>{action}</div> : null}
      </div>
    </Empty>
  );
}

export function AppEmptyStateAction({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <Button type="primary" onClick={onClick}>
      {label}
    </Button>
  );
}
