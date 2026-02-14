import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FieldRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldRow({ label, required, children }: FieldRowProps) {
  return (
    <div className="flex items-center py-4 border-b border-border last:border-b-0">
      <div className="w-36 shrink-0 text-sm text-muted-foreground">{label}</div>
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

export default function UserEditPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "",
    clinic: "",
    name: "",
    account: "",
    title: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.role || !form.name.trim() || !form.account.trim() || !form.title.trim()) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    toast.success("已新增使用者");
    navigate("/users");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        使用者管理 &gt; 使用者列表 &gt; 新增使用者
      </div>
      <h1 className="text-2xl font-semibold mb-5">新增使用者</h1>

      <div className="bg-card rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">管理者使用者資訊</h2>

        <FieldRow label="身份" required>
          <Select value={form.role} onValueChange={(v) => update("role", v)}>
            <SelectTrigger className="bg-muted/50 text-sm">
              <SelectValue placeholder="---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="管理者">管理者</SelectItem>
              <SelectItem value="診所">診所</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="診所別" required>
          <Select value={form.clinic} onValueChange={(v) => update("clinic", v)}>
            <SelectTrigger className="bg-muted/50 text-sm">
              <SelectValue placeholder="---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="健康呼吸">健康呼吸</SelectItem>
              <SelectItem value="中崙國際診所">中崙國際診所</SelectItem>
              <SelectItem value="關心診所">關心診所</SelectItem>
              <SelectItem value="愷馨耳鼻喉科診所">愷馨耳鼻喉科診所</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="名稱" required>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="bg-muted/50 text-sm"
          />
        </FieldRow>

        <FieldRow label="使用者帳號" required>
          <Input
            value={form.account}
            onChange={(e) => update("account", e.target.value)}
            className="bg-muted/50 text-sm"
            placeholder="name@demo.com"
          />
        </FieldRow>

        <FieldRow label="職稱" required>
          <Input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="bg-muted/50 text-sm"
          />
        </FieldRow>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="px-8">
            新增
          </Button>
        </div>
      </div>
    </div>
  );
}
