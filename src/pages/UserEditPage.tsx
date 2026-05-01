import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchUser, createUser, updateUser } from "@/api/users";
import { fetchClinicList } from "@/api/clinics";

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
  const queryClient = useQueryClient();
  const isNew = !id;

  const [form, setForm] = useState({
    roleid: "",
    clinicid: "",
    name: "",
    account: "",
    title: "",
  });

  // 編輯模式：取得使用者資料
  const { data: userData } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(Number(id)),
    enabled: !isNew,
  });

  useEffect(() => {
    if (userData) {
      setForm((prev) => ({
        ...prev,
        name: userData.name ?? "",
        account: userData.email ?? "",
        title: userData.jobTitle ?? "",
      }));
    }
  }, [userData]);

  // 新增模式：診所選單
  const { data: clinics = [] } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => fetchClinicList(),
    enabled: isNew,
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 新增
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("已新增使用者");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // 修改
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("已儲存變更");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSave = () => {
    if (isNew) {
      if (!form.roleid || !form.name.trim() || !form.account.trim() || !form.title.trim()) {
        toast.error("請填寫所有必填欄位");
        return;
      }
      const roleid = Number(form.roleid);
      if (roleid === 2 && !form.clinicid) {
        toast.error("請填寫所有必填欄位");
        return;
      }
      createMutation.mutate({
        username: form.name.trim(),
        email: form.account.trim(),
        jobtitle: form.title.trim(),
        roleid,
        clinicid: roleid === 2 ? Number(form.clinicid) : null,
      });
    } else {
      if (!form.name.trim() || !form.title.trim()) {
        toast.error("請填寫所有必填欄位");
        return;
      }
      updateMutation.mutate({
        id: Number(id),
        username: form.name.trim(),
        jobtitle: form.title.trim(),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        使用者管理 &gt; 使用者列表 &gt; {isNew ? "新增使用者" : "編輯使用者"}
      </div>
      <h1 className="text-2xl font-semibold mb-5">{isNew ? "新增使用者" : "編輯使用者"}</h1>

      <div className="bg-card rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">管理者使用者資訊</h2>

        {isNew ? (
          <>
            <FieldRow label="身份" required>
              <Select value={form.roleid} onValueChange={(v) => update("roleid", v)}>
                <SelectTrigger className="bg-muted/50 text-sm">
                  <SelectValue placeholder="---" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">管理者</SelectItem>
                  <SelectItem value="2">診所</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="診所別" required>
              <Select value={form.clinicid} onValueChange={(v) => update("clinicid", v)}>
                <SelectTrigger className="bg-muted/50 text-sm">
                  <SelectValue placeholder="---" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
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
          <Button onClick={handleSave} className="px-8" disabled={isSaving}>
            {isNew ? "新增" : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
