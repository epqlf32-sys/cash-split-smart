import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSplit } from "@/context/SplitContext";
import { ArrowRight, Wallet } from "lucide-react";

interface SettlementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettlementSheet = ({ open, onOpenChange }: SettlementSheetProps) => {
  const { people, getSettlements, getPersonSpending } = useSplit();
  const settlements = getSettlements();
  const spending = getPersonSpending();

  const getName = (id: string) => people.find((p) => p.id === id)?.name || "?";
  const formatMoney = (n: number) => n.toLocaleString("ko-KR") + "원";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>1/N 정산 내역</SheetTitle>
          <SheetDescription>누가 누구에게 얼마를 보내야 하는지 확인하세요</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Settlement transfers */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">송금 내역</h3>
            {settlements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">정산할 내역이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-card border p-4"
                  >
                    <span className="font-semibold text-settle-negative">{getName(s.fromId)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-settle-positive">{getName(s.toId)}</span>
                    <span className="ml-auto font-bold">{formatMoney(s.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal spending */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">개인별 지출 금액</h3>
            <div className="space-y-2">
              {spending
                .filter((s) => s.amount > 0)
                .map((s) => (
                  <div
                    key={s.personId}
                    className="flex items-center justify-between rounded-xl bg-card border p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-medium">{getName(s.personId)}</span>
                    </div>
                    <span className="font-bold">{formatMoney(s.amount)} 지출</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettlementSheet;
