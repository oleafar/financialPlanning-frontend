import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { MonthSummary } from '../types';
import { formatMonthYear } from '../utils/transactions';

interface ChartData {
  name: string;
  Entradas: number;
  Saídas: number;
}

interface MonthlyChartProps {
  data: MonthSummary[];
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sem dados para exibir
      </div>
    );
  }

  const chartData: ChartData[] = data.slice(-6).map((d) => ({
    name: formatMonthYear(d.month)
      .replace(/^\w/, (c) => c.toUpperCase())
      .split(' de ')
      .map((part, i) => (i === 0 ? part.slice(0, 3) : part))
      .join('/'),
    Entradas: d.income,
    Saídas: d.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatBRL} tick={{ fontSize: 11 }} width={80} />
        <Tooltip
          formatter={(value) => (typeof value === 'number' ? formatBRL(value) : String(value))}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Legend />
        <Bar dataKey="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Saídas" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
