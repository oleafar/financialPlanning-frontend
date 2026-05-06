import { Alert, Flex, Spin } from "antd";
import { ReactNode } from "react";

type AsyncContentProps = {
  isLoading?: boolean;
  error?: string | null;
  children: ReactNode;
};

export function AsyncContent({ isLoading, error, children }: AsyncContentProps) {
  if (isLoading) {
    return (
      <Flex align="center" justify="center" className="async-center">
        <Spin size="large" />
      </Flex>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  return <>{children}</>;
}
