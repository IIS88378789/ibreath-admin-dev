import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Referral {
  id: number;
  order: number;
  name: string;
}

const initialReferrals: Referral[] = [
  { id: 1, order: 1, name: "台中榮總" },
  { id: 2, order: 2, name: "台北馬偕醫院" },
  { id: 3, order: 3, name: "林釗尚小兒科診所(臺中市大雅區)" },
  { id: 4, order: 4, name: "德昌小兒科診所(烏日)" },
  { id: 5, order: 5, name: "承鴻耳鼻喉科診所(北區)" },
];

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Referral[]>(initialReferrals);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState("");

  const handleSearch = () => {
    const result = referrals.filter((r) => r.name.includes(search));
    setFiltered(result);
  };

  const handleReset = () => {
    setSearch("");
    setFiltered(referrals);
  };

  const handleDelete = (id: number) => {
    const updated = referrals.filter((r) => r.id !== id);
    setReferrals(updated);
    setFiltered(updated.filter((r) => r.name.includes(search)));
    toast.success("已刪除轉介診所");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormOrder(String((referrals.length > 0 ? Math.max(...referrals.map(r => r.order)) : 0) + 1));
    setDialogOpen(true);
  };

  const openEdit = (referral: Referral) => {
    setEditingId(referral.id);
    setFormName(referral.name);
    setFormOrder(String(referral.order));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formOrder.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }

    if (editingId !== null) {
      const updated = referrals.map((r) =>
        r.id === editingId ? { ...r, name: formName.trim(), order: Number(formOrder) } : r
      );
      setReferrals(updated);
      setFiltered(updated.filter((r) => r.name.includes(search)));
      toast.success("已更新轉介診所");
    } else {
      const newId = Math.max(0, ...referrals.map((r) => r.id)) + 1;
      const newReferral: Referral = { id: newId, order: Number(formOrder), name: formName.trim() };
      const updated = [...referrals, newReferral];
      setReferrals(updated);
      setFiltered(updated.filter((r) => r.name.includes(search)));
      toast.success("已新增轉介診所");
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        轉介診所管理 &gt; 轉介列表
      </div>
      <h1 className="text-2xl font-semibold mb-5">轉介診所列表</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <Label className="text-[14px] font-medium mb-2 block">診所名稱</Label>
        <div className="flex items-center gap-3">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value === "") handleReset();
            }}
            className="max-w-xs text-[14px]"
            placeholder="輸入診所名稱"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            新增轉介診所
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">排序</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">診所名稱</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="text-sm text-center">{referral.order}</TableCell>
                <TableCell className="text-sm font-medium">{referral.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" className="text-[13px]" onClick={() => openEdit(referral)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(referral.id)}
                      className="text-[13px]"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  沒有找到轉介診所
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>轉介診所資訊</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Label className="w-28 shrink-0 text-sm">轉介診所名稱</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="flex-1 text-sm"
                placeholder="輸入診所名稱"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-28 shrink-0 text-sm">排序</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(e.target.value)}
                className="flex-1 text-sm"
                placeholder="輸入排序"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={handleSave}>儲存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
