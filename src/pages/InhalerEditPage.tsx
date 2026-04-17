import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useInhalerStore } from "@/stores/inhalerStore";

interface FieldRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldRow({ label, required, children }: FieldRowProps) {
  return (
    <div className="flex items-start py-4 border-b border-border last:border-b-0">
      <div className="w-36 shrink-0 text-sm text-muted-foreground pt-2">{label}</div>
      <div className="flex items-center gap-2 shrink-0">
        {required && (
          <span className="text-xs text-destructive border border-destructive/50 rounded px-1.5 py-0.5">必填*</span>
        )}
      </div>
      <div className="flex-1 ml-3">{children}</div>
    </div>
  );
}

export default function InhalerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inhalers, categories, addInhaler, updateInhaler } = useInhalerStore();
  const isNew = !id;
  const existing = id ? inhalers.find((i) => i.id === Number(id)) : null;

  const [form, setForm] = useState({
    name: existing?.name || "",
    category: existing?.category || (categories[0]?.name || ""),
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.category) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    if (isNew) {
      const nextOrder = (inhalers.length > 0 ? Math.max(...inhalers.map((i) => i.order)) : 0) + 1;
      addInhaler({ name: form.name.trim(), order: nextOrder, category: form.category });
      toast.success("已新增吸入器");
    } else {
      updateInhaler(Number(id), { name: form.name.trim(), category: form.category });
      toast.success("已儲存變更");
    }
    navigate("/inhalers");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        吸入器管理 &gt; 吸入器列表 &gt; {isNew ? "新增吸入器" : "編輯吸入器"}
      </div>
      <h1 className="text-2xl font-semibold mb-5">{isNew ? "新增吸入器" : "編輯吸入器"}</h1>

      <div className="bg-card rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">吸入器資訊</h2>

        <FieldRow label="吸入器名稱" required>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-muted/50 text-sm" />
        </FieldRow>

        <FieldRow label="分類" required>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger className="bg-muted/50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="px-8">{isNew ? "新增" : "儲存"}</Button>
        </div>
      </div>
    </div>
  );
}
