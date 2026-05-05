import { useState, useMemo } from 'react';
import type { Transaction } from './types';
import { useTransactions, useCategories } from './hooks/useStorage';
import { SummaryCard } from './components/SummaryCard';
import { MonthlyChart } from './components/MonthlyChart';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Modal } from './components/Modal';
import {
  calculateTotals,
  groupByMonth,
  filterTransactionsByMonth,
  formatMonthYear,
  getTodayString,
} from './utils/transactions';

type ActiveTab = 'dashboard' | 'transactions';

export default function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();
  const { categories } = useCategories();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Current month filter (defaults to current month)
  const currentMonth = getTodayString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const monthlyTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const totals = useMemo(
    () => calculateTotals(monthlyTransactions),
    [monthlyTransactions]
  );

  const allTotals = useMemo(() => calculateTotals(transactions), [transactions]);

  const monthlyData = useMemo(() => groupByMonth(transactions), [transactions]);

  // Available months from transactions + current month
  const availableMonths = useMemo(() => {
    const months = new Set(
      transactions.map((t) => t.date.slice(0, 7))
    );
    months.add(currentMonth);
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions, currentMonth]);

  function handleSave(transaction: Transaction) {
    if (editingTransaction) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    setShowForm(false);
    setEditingTransaction(null);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingTransaction(null);
  }

  const tabClass = (tab: ActiveTab) =>
    `px-5 py-2.5 text-sm font-medium rounded-lg transition ${
      activeTab === tab
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
              Planejamento Financeiro
            </h1>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={tabClass('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={tabClass('transactions')}
            >
              📋 Transações
            </button>
          </nav>

          {/* Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            {/* Month selector */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {formatMonthYear(selectedMonth)
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </h2>
                <p className="text-sm text-gray-500">Resumo do mês</p>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthYear(m).replace(/^\w/, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                title="Entradas"
                amount={totals.income}
                icon="↑"
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50"
              />
              <SummaryCard
                title="Saídas"
                amount={totals.expense}
                icon="↓"
                colorClass="text-orange-600"
                bgClass="bg-orange-50"
              />
              <SummaryCard
                title="Saldo"
                amount={totals.balance}
                icon="＝"
                colorClass={totals.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}
                bgClass={totals.balance >= 0 ? 'bg-indigo-50' : 'bg-red-50'}
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Entradas vs. Saídas (últimos 6 meses)
              </h3>
              <MonthlyChart data={monthlyData} />
            </div>

            {/* Overall totals */}
            {transactions.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Totais gerais
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Entradas</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(allTotals.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Saídas</p>
                    <p className="text-lg font-bold text-orange-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(allTotals.expense)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Saldo Total</p>
                    <p
                      className={`text-lg font-bold ${
                        allTotals.balance >= 0 ? 'text-indigo-600' : 'text-red-600'
                      }`}
                    >
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(allTotals.balance)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent transactions */}
            {monthlyTransactions.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Transações recentes
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Ver todas →
                  </button>
                </div>
                <div className="space-y-2">
                  {monthlyTransactions.slice(0, 5).map((t) => {
                    const cat = categories.find((c) => c.id === t.category);
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color ?? '#6b7280' }}
                          />
                          <span className="text-sm text-gray-700">
                            {t.description || cat?.name || t.category}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            t.type === 'income' ? 'text-emerald-600' : 'text-orange-600'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(t.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state for dashboard */}
            {transactions.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-4">💸</p>
                <p className="text-base font-medium text-gray-500">
                  Comece registrando suas transações
                </p>
                <p className="text-sm mt-1 mb-6">
                  Controle suas entradas e saídas de dinheiro
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
                >
                  + Adicionar primeira transação
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Transações</h2>
                <p className="text-sm text-gray-500">
                  {transactions.length} registro{transactions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                + Adicionar
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <TransactionList
                transactions={transactions}
                categories={categories}
                onEdit={handleEdit}
                onDelete={deleteTransaction}
              />
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <Modal
          title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          onClose={handleCloseForm}
        >
          <TransactionForm
            categories={categories}
            onSave={handleSave}
            onCancel={handleCloseForm}
            initial={editingTransaction}
          />
        </Modal>
      )}
    </div>
  );
}
