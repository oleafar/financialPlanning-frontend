import { Card, Statistic } from "antd";

type SummaryStatCardProps = {
  title: string;
  value: string;
  tone?: "default" | "success" | "danger";
};

export function SummaryStatCard({ title, value, tone = "default" }: SummaryStatCardProps) {
  return (
    <Card className={`summary-card summary-card-${tone}`}>
      <Statistic title={title} value={value} />
    </Card>
  );
}
