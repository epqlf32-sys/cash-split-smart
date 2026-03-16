import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSplit } from "@/context/SplitContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHART_COLORS = [
  "hsl(160, 60%, 40%)",
  "hsl(35, 90%, 55%)",
  "hsl(220, 70%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(340, 65%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(60, 70%, 50%)",
];

const StatsSheet = ({ open, onOpenChange }: StatsSheetProps) => {
  const { getCategoryStats, items } = useSplit();
  const stats = getCategoryStats();
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const formatMoney = (n: number) => n.toLocaleString("ko-KR") + "원";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>지출 통계</SheetTitle>
          <SheetDescription>항목별 지출 비율을 확인하세요</SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <p className="text-center text-2xl font-bold mb-4">
            총 {formatMoney(total)}
          </p>

          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">입력된 항목이 없습니다</p>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      dataKey="amount"
                      nameKey="description"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                      label={({ description, percent }) =>
                        `${description} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="font-medium text-sm">{s.description}</span>
                    </div>
                    <span className="font-semibold text-sm">{formatMoney(s.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StatsSheet;
