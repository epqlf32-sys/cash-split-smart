import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSplit } from "@/context/SplitContext";
import { UserPlus, X } from "lucide-react";

interface PeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PeopleDialog = ({ open, onOpenChange }: PeopleDialogProps) => {
  const { people, addPerson, removePerson } = useSplit();
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addPerson(trimmed);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>인원 관리</DialogTitle>
          <DialogDescription>함께 정산할 인원을 추가하세요</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2.5"
            >
              <span className="font-medium text-secondary-foreground">{person.name}</span>
              <button
                onClick={() => removePerson(person.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {people.length === 0 && (
            <p className="text-center text-muted-foreground py-6 text-sm">
              아직 추가된 인원이 없습니다
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeopleDialog;
