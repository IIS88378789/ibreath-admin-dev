import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useDiseaseStore } from "@/stores/diseaseStore";

const categories = ["all", "氣喘", "肺阻塞"];

export default function DiseasesPage() {
  const { diseases, addDisease, updateDisease, deleteDisease } = useDiseaseStore();
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState("");
  const [formCategory, setFormCategory] = useState("氣喘");

  const filtered = categoryFilter === "all"
    ? diseases
    : diseases.filter((d) => d.category === categoryFilter);

  const handleDelete = (id: number) => {
    deleteDisease(id);
    toast.success("已刪除疾病");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormCategory("氣喘");
    setFormOrder(String((diseases.length > 0 ? Math.max(...diseases.map((d) => d.order)) : 0) + 1));
    setDialogOpen(true);
  };

  const openEdit = (disease: { id: number; name: string; order: number; category: string }) => {
    setEditingId(disease.id);
    setFormName(disease.name);
    setFormOrder(String(disease.order));
    setFormCategory(disease.category);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formOrder.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }

    if (editingId !== null) {
      updateDisease(editingId, {
        name: formName.trim(),
        order: Number(formOrder),
        category: formCategory,
      });
      toast.success("已更新疾病");
    } else {
      addDisease({
        order: Number(formOrder),
        name: formName.trim(),
        category: formCategory,
      });
      toast.success("已新增疾病");
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">疾病管理 &gt; 疾病列表</div>
      <h1 className="text-2xl font-semibold mb-5">疾病管理</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <Label className="text-[14px] font-medium mb-2 block">疾病分類</Label>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="max-w-xs text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-[14px]">
                  {cat === "all" ? "全部" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            新增疾病
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">排序</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">疾病名稱</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">分類</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((disease) => (
              <TableRow key={disease.id}>
                <TableCell className="text-sm text-center">{disease.order}</TableCell>
                <TableCell className="text-sm font-medium">{disease.name}</TableCell>
                <TableCell className="text-sm">{disease.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" className="text-[13px]" onClick={() => openEdit(disease)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(disease.id)}
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
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  沒有找到疾病資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "編輯疾病" : "新增疾病"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">疾病名稱</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="flex-1 text-sm"
                placeholder="輸入疾病名稱"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">分類</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="flex-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="氣喘">氣喘</SelectItem>
                  <SelectItem value="肺阻塞">肺阻塞</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">排序</Label>
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
