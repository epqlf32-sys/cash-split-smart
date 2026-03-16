import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSplit } from "@/context/SplitContext";
import { Button } from "@/components/ui/button";
import { PieChart, Users, Calculator, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PeopleDialog from "@/components/PeopleDialog";
import SettlementSheet from "@/components/SettlementSheet";
import StatsSheet from "@/components/StatsSheet";

const Index = () => {
  const navigate = useNavigate();
  const { people, items, removeItem } = useSplit();
  const [showPeople, setShowPeople] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const getName = (id: string) => people.find((p) => p.id === id)?.name || "?";
  const formatMoney = (n: number) => n.toLocaleString("ko-KR") + "원";
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold mb-3">💸 1/N 정산</h1>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setShowStats(true)}
            >
              <PieChart className="h-4 w-4" />
              통계
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setShowSettlement(true)}
            >
              <Calculator className="h-4 w-4" />
              1/N
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setShowPeople(true)}
            >
              <Users className="h-4 w-4" />
              인원 ({people.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-24 max-w-lg mx-auto w-full">
        {/* Total */}
        {items.length > 0 && (
          <div className="px-4 pt-4">
            <div className="rounded-xl bg-primary p-4 text-primary-foreground">
              <p className="text-sm opacity-80">총 금액</p>
              <p className="text-2xl font-bold">{formatMoney(total)}</p>
              <p className="text-sm opacity-80 mt-1">{items.length}건</p>
            </div>
          </div>
        )}

        {/* Item list */}
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="rounded-xl bg-card border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.description}</h3>
                    <p className="text-lg font-bold mt-1">{formatMoney(item.amount)}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                        결제: {getName(item.payerId)}
                      </span>
                      {item.splitWithIds.map((sid) => (
                        <span
                          key={sid}
                          className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {getName(sid)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🧾</p>
              <p className="text-muted-foreground font-medium">아직 항목이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                + 버튼을 눌러 항목을 추가하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating add button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/add")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-20"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Modals */}
      <PeopleDialog open={showPeople} onOpenChange={setShowPeople} />
      <SettlementSheet open={showSettlement} onOpenChange={setShowSettlement} />
      <StatsSheet open={showStats} onOpenChange={setShowStats} />
    </div>
  );
};

export default Index;
