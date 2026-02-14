import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const mockUsers: Record<string, { name: string; account: string; title: string; role: string; clinic: string }> = {
  "1": { name: "CodingIT Admin", account: "service@codingit.tw", title: "Admin", role: "管理者", clinic: "" },
  "2": { name: "Admin", account: "vivien5513745@gmail.com", title: "Admin", role: "管理者", clinic: "" },
  "3": { name: "Admin", account: "shuo6878@gmail.com", title: "Admin", role: "管理者", clinic: "" },
  "4": { name: "Admin", account: "ibreath1063@gmail.com", title: "Admin", role: "管理者", clinic: "" },
  "5": { name: "愛而生", account: "service.ibreath@gmail.com", title: "測試", role: "診所", clinic: "健康呼吸" },
  "6": { name: "測試", account: "ybeei740317@gmail.com", title: "醫師", role: "診所", clinic: "中崙國際診所" },
};

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
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const existing = id && mockUsers[id] ? mockUsers[id] : null;

  const [form, setForm] = useState({
    role: existing?.role || "",
    clinic: existing?.clinic || "",
    name: existing?.name || "",
    account: existing?.account || "",
    title: existing?.title || "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.title.trim()) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    if (isNew && (!form.role || !form.account.trim())) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    toast.success(isNew ? "已新增使用者" : "已儲存變更");
    navigate("/users");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        使用者管理 &gt; 使用者列表 &gt; {isNew ? "新增使用者" : "編輯使用者"}
      </div>
      <h1 className="text-2xl font-semibold mb-5">{isNew ? "新增使用者" : "編輯使用者"}</h1>

      <div className="bg-card rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">管理者使用者資訊</h2>

        {isNew ? (
          <>
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
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-muted/50 text-sm" />
            </FieldRow>

            <FieldRow label="使用者帳號" required>
              <Input value={form.account} onChange={(e) => update("account", e.target.value)} className="bg-muted/50 text-sm" placeholder="name@demo.com" />
            </FieldRow>

            <FieldRow label="職稱" required>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} className="bg-muted/50 text-sm" />
            </FieldRow>
          </>
        ) : (
          <>
            <FieldRow label="名稱" required>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-muted/50 text-sm" />
            </FieldRow>

            <FieldRow label="使用者帳號">
              <span className="text-sm">{form.account}</span>
            </FieldRow>

            <FieldRow label="職稱" required>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} className="bg-muted/50 text-sm" />
            </FieldRow>
          </>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="px-8">
            {isNew ? "新增" : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
