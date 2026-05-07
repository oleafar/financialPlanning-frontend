import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you tried to access does not exist."
      extra={
        <Button type="primary">
          <Link to="/dashboard">Back to app</Link>
        </Button>
      }
    />
  );
}
