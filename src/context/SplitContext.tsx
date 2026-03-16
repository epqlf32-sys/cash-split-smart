import React, { createContext, useContext, useState, useCallback } from "react";

export interface Person {
  id: string;
  name: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  splitWithIds: string[];
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

interface SplitContextType {
  people: Person[];
  items: ExpenseItem[];
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addItem: (item: Omit<ExpenseItem, "id">) => void;
  removeItem: (id: string) => void;
  editItem: (item: ExpenseItem) => void;
  getSettlements: () => Settlement[];
  getPersonSpending: () => { personId: string; amount: number }[];
  getCategoryStats: () => { description: string; amount: number }[];
}

const SplitContext = createContext<SplitContextType | null>(null);

export const useSplit = () => {
  const ctx = useContext(SplitContext);
  if (!ctx) throw new Error("useSplit must be used within SplitProvider");
  return ctx;
};

export const SplitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<ExpenseItem[]>([]);

  const addPerson = useCallback((name: string) => {
    setPeople((prev) => [...prev, { id: crypto.randomUUID(), name }]);
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setItems((prev) =>
      prev
        .map((item) => ({
          ...item,
          splitWithIds: item.splitWithIds.filter((sid) => sid !== id),
        }))
        .filter((item) => item.payerId !== id)
    );
  }, []);

  const addItem = useCallback((item: Omit<ExpenseItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const editItem = useCallback((item: ExpenseItem) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  }, []);

  const getSettlements = useCallback((): Settlement[] => {
    // Calculate net balance per person
    const balances: Record<string, number> = {};
    people.forEach((p) => (balances[p.id] = 0));

    items.forEach((item) => {
      const splitCount = item.splitWithIds.length;
      if (splitCount === 0) return;
      const share = item.amount / splitCount;

      // Payer paid the full amount
      balances[item.payerId] = (balances[item.payerId] || 0) + item.amount;

      // Each splitter owes their share
      item.splitWithIds.forEach((pid) => {
        balances[pid] = (balances[pid] || 0) - share;
      });
    });

    // Settle debts
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, balance]) => {
      if (balance > 0.01) creditors.push({ id, amount: balance });
      else if (balance < -0.01) debtors.push({ id, amount: -balance });
    });

    const settlements: Settlement[] = [];
    let di = 0,
      ci = 0;

    while (di < debtors.length && ci < creditors.length) {
      const transfer = Math.min(debtors[di].amount, creditors[ci].amount);
      if (transfer > 0.01) {
        settlements.push({
          fromId: debtors[di].id,
          toId: creditors[ci].id,
          amount: Math.round(transfer),
        });
      }
      debtors[di].amount -= transfer;
      creditors[ci].amount -= transfer;
      if (debtors[di].amount < 0.01) di++;
      if (creditors[ci].amount < 0.01) ci++;
    }

    return settlements;
  }, [people, items]);

  const getPersonSpending = useCallback(() => {
    const spending: Record<string, number> = {};
    people.forEach((p) => (spending[p.id] = 0));
    items.forEach((item) => {
      spending[item.payerId] = (spending[item.payerId] || 0) + item.amount;
    });
    return Object.entries(spending).map(([personId, amount]) => ({ personId, amount }));
  }, [people, items]);

  const getCategoryStats = useCallback(() => {
    const stats: Record<string, number> = {};
    items.forEach((item) => {
      stats[item.description] = (stats[item.description] || 0) + item.amount;
    });
    return Object.entries(stats).map(([description, amount]) => ({ description, amount }));
  }, [items]);

  return (
    <SplitContext.Provider
      value={{
        people,
        items,
        addPerson,
        removePerson,
        addItem,
        removeItem,
        editItem,
        getSettlements,
        getPersonSpending,
        getCategoryStats,
      }}
    >
      {children}
    </SplitContext.Provider>
  );
};
