import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useInhalerStore } from "@/stores/inhalerStore";

export default function InhalerCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useInhalerStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormOrder(String((categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0) + 1));
    setDialogOpen(true);
  };

  const openEdit = (cat: { id: number; name: string; order: number }) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormOrder(String(cat.order));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formOrder.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }
    if (editingId !== null) {
      updateCategory(editingId, { name: formName.trim(), order: Number(formOrder) });
      toast.success("已更新分類");
    } else {
      addCategory({ name: formName.trim(), order: Number(formOrder) });
      toast.success("已新增分類");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteCategory(id);
    toast.success("已刪除分類");
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">吸入器管理 &gt; 吸入器分類</div>
      <h1 className="text-2xl font-semibold mb-5">吸入器分類</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-end">
          <Button variant="outline" size="sm" className="text-[14px]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            新增分類
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">排序</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">分類名稱</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="text-sm text-center">{cat.order}</TableCell>
                <TableCell className="text-sm font-medium">{cat.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" className="text-[13px]" onClick={() => openEdit(cat)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)} className="text-[13px]">
                      <X className="h-3.5 w-3.5 mr-1" />
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  沒有找到分類資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "編輯分類" : "新增分類"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">分類名稱</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="flex-1 text-sm" placeholder="輸入分類名稱" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">排序</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Input type="number" value={formOrder} onChange={(e) => setFormOrder(e.target.value)} className="flex-1 text-sm" placeholder="輸入排序" />
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
