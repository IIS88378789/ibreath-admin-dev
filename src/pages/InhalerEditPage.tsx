import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const mockInhalers: Record<string, { name: string; order: number }> = {
  "1": { name: "使肺泰 Seretide", order: 1 },
  "2": { name: "肺舒坦 Foster", order: 2 },
  "3": { name: "潤娃易利達 Relvar", order: 3 },
  "4": { name: "吸必擴 Rapihaler", order: 5 },
};

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
          <span className="text-xs text-destructive border border-destructive/50 rounded px-1.5 py-0.5">
            必填*
          </span>
        )}
      </div>
      <div className="flex-1 ml-3">{children}</div>
    </div>
  );
}

export default function InhalerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const existing = id && mockInhalers[id] ? mockInhalers[id] : null;

  const [form, setForm] = useState({
    name: existing?.name || "",
    order: existing?.order?.toString() || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.order.trim()) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    toast.success(isNew ? "已新增吸入器" : "已儲存變更");
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

        <FieldRow label="吸入器圖片">
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {imagePreview && (
              <img src={imagePreview} alt="預覽" className="mt-3 max-w-xs rounded border border-border" />
            )}
          </div>
        </FieldRow>

        <FieldRow label="吸入器名稱" required>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="bg-muted/50 text-sm"
          />
        </FieldRow>

        <FieldRow label="排序" required>
          <Input
            value={form.order}
            onChange={(e) => update("order", e.target.value)}
            className="bg-muted/50 text-sm"
            type="number"
          />
        </FieldRow>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="px-8">
            {isNew ? "新增" : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
