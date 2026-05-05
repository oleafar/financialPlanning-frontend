import { useState } from 'react';
import type { Transaction, Category } from '../types';
import { generateId, getTodayString } from '../utils/transactions';

interface TransactionFormProps {
  categories: Category[];
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  initial?: Transaction | null;
}

export function TransactionForm({
  categories,
  onSave,
  onCancel,
  initial,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(
    initial?.type ?? 'expense'
  );
  const [amount, setAmount] = useState<string>(
    initial ? String(initial.amount) : ''
  );
  const [category, setCategory] = useState<string>(initial?.category ?? '');
  const [description, setDescription] = useState<string>(
    initial?.description ?? ''
  );
  const [date, setDate] = useState<string>(initial?.date ?? getTodayString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter((c) => c.type === type);

  // Derive effective category: clear if it doesn't belong to the current type
  const effectiveCategory =
    category && filteredCategories.some((c) => c.id === category)
      ? category
      : '';

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Informe um valor válido maior que zero';
    }
    if (!effectiveCategory) {
      newErrors.category = 'Selecione uma categoria';
    }
    if (!date) {
      newErrors.date = 'Informe uma data';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    const transaction: Transaction = {
      id: initial?.id ?? generateId(),
      type,
      amount: parsedAmount,
      category: effectiveCategory,
      description: description.trim(),
      date,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };

    onSave(transaction);
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition';
  const errorClass = 'text-red-500 text-xs mt-1';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div>
        <label className={labelClass}>Tipo</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 text-sm font-medium transition ${
              type === 'income'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ↑ Entrada
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 text-sm font-medium transition ${
              type === 'expense'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ↓ Saída
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className={labelClass}>
          Valor (R$)
        </label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />
        {errors.amount && <p className={errorClass}>{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>
          Categoria
        </label>
        <select
          id="category"
          value={effectiveCategory}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">Selecione uma categoria</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && <p className={errorClass}>{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Descrição
        </label>
        <input
          id="description"
          type="text"
          placeholder="Descrição opcional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className={labelClass}>
          Data
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
        {errors.date && <p className={errorClass}>{errors.date}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`flex-1 rounded-lg py-2 text-sm font-medium text-white transition ${
            type === 'income'
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {initial ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
