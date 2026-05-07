import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Pagina nao encontrada"
      subTitle="A pagina que voce tentou acessar nao existe."
      extra={
        <Button type="primary">
          <Link to="/dashboard">Voltar ao app</Link>
        </Button>
      }
    />
  );
}
