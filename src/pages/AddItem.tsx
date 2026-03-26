import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSplit } from "@/context/SplitContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AddItem = () => {
  const navigate = useNavigate();
  const { people, addPerson, addItem } = useSplit();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [payerId, setPayerId] = useState<string | null>(null);
  const [splitWithIds, setSplitWithIds] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState("");

  const toggleSplit = (id: string) => {
    setSplitWithIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const numAmount = parseInt(amount.replace(/,/g, ""), 10);
    if (!numAmount || numAmount <= 0) {
      toast.error("금액을 입력해주세요");
      return;
    }
    if (!description.trim()) {
      toast.error("항목 내용을 입력해주세요");
      return;
    }
    if (!payerId) {
      toast.error("결제자를 선택해주세요");
      return;
    }
    if (splitWithIds.size === 0) {
      toast.error("함께 낼 사람을 선택해주세요");
      return;
    }

    addItem({
      amount: numAmount,
      description: description.trim(),
      payerId,
      splitWithIds: Array.from(splitWithIds),
    });

    toast.success("항목이 추가되었습니다");
    navigate("/");
  };

  const formatAmount = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    if (!num) return "";
    return parseInt(num, 10).toLocaleString("ko-KR");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">항목 추가</h1>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">금액</label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(formatAmount(e.target.value))}
              className="text-2xl font-bold h-14 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              원
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">항목 내용</label>
          <Input
            placeholder="예: 1차 술값"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12"
          />
        </div>

        {/* People selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">인원 선택</label>
          {people.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-secondary">
              <p className="text-muted-foreground text-sm">먼저 메인 화면에서 인원을 추가해주세요</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                <span>이름</span>
                <span className="text-center">결제</span>
                <span className="text-center">함께 내기</span>
              </div>
              {people.map((person) => (
                <div
                  key={person.id}
                  className="grid grid-cols-3 items-center px-4 py-3 border-t"
                >
                  <span className="font-medium text-sm">{person.name}</span>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={payerId === person.id}
                      onCheckedChange={(checked) => {
                        if (checked) setPayerId(person.id);
                        else if (payerId === person.id) setPayerId(null);
                      }}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={splitWithIds.has(person.id)}
                      onCheckedChange={() => toggleSplit(person.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {payerId && splitWithIds.size > 0 && amount && (
          <div className="rounded-xl bg-primary/10 p-4 space-y-1">
            <p className="text-xs font-semibold text-primary">미리보기</p>
            <p className="text-sm">
              1인당{" "}
              <span className="font-bold">
                {Math.round(
                  parseInt(amount.replace(/,/g, ""), 10) / splitWithIds.size
                ).toLocaleString("ko-KR")}
                원
              </span>{" "}
              ({splitWithIds.size}명)
            </p>
          </div>
        )}

        {/* Save button */}
        <Button onClick={handleSave} className="w-full h-12 text-base gap-2">
          <Save className="h-4 w-4" />
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default AddItem;
