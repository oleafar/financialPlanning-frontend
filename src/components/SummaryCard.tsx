import type { ReactNode } from 'react';
import { formatCurrency } from '../utils/transactions';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: ReactNode;
  colorClass: string;
  bgClass: string;
}

export function SummaryCard({ title, amount, icon, colorClass, bgClass }: SummaryCardProps) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm border border-gray-100 bg-white flex items-center gap-4`}>
      <div className={`rounded-xl p-3 ${bgClass} flex items-center justify-center`}>
        <span className={`text-2xl ${colorClass}`}>{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{formatCurrency(amount)}</span>
      </div>
    </div>
  );
}
