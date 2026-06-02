export default function DiseasesPage() {
  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">疾病管理 &gt; 疾病列表</div>
      <h1 className="text-2xl font-semibold mb-5">疾病管理</h1>
      <p className="text-muted-foreground">功能建置中</p>
    </div>
  );
}

/*
import { useState } from "react";
import { Plus, Pencil, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDiseaseStore } from "@/stores/diseaseStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const categories = ["all", "氣喘", "肺阻塞"];

interface SortableRowProps {
  disease: { id: number; order: number; name: string; category: string };
  onEdit: () => void;
  onDelete: () => void;
}

function SortableRow({ disease, onEdit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: disease.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="text-sm text-center w-24">
        <div className="flex items-center justify-center gap-1">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </button>
          {disease.order}
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium">{disease.name}</TableCell>
      <TableCell className="text-sm">{disease.category}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" className="text-[13px]" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-1" />編輯
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} className="text-[13px]">
            <X className="h-3.5 w-3.5 mr-1" />刪除
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DiseasesPageFull() {
  const { diseases, addDisease, updateDisease, deleteDisease, reorderDiseases } = useDiseaseStore();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("氣喘");

  const sorted = [...diseases].sort((a, b) => a.order - b.order);
  const filtered = categoryFilter === "all" ? sorted : sorted.filter((d) => d.category === categoryFilter);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((d) => d.id === active.id);
    const newIndex = sorted.findIndex((d) => d.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    reorderDiseases(reordered.map((d) => d.id));
    toast.success("已更新排序");
  };

  const handleDelete = (id: number) => {
    deleteDisease(id);
    toast.success("已刪除疾病");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormCategory("氣喘");
    setDialogOpen(true);
  };

  const openEdit = (disease: { id: number; name: string; order: number; category: string }) => {
    setEditingId(disease.id);
    setFormName(disease.name);
    setFormCategory(disease.category);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }
    if (editingId !== null) {
      updateDisease(editingId, { name: formName.trim(), category: formCategory });
      toast.success("已更新疾病");
    } else {
      const nextOrder = (diseases.length > 0 ? Math.max(...diseases.map((d) => d.order)) : 0) + 1;
      addDisease({ order: nextOrder, name: formName.trim(), category: formCategory });
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
            <SelectTrigger className="max-w-xs text-[14px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-[14px]">{cat === "all" ? "全部" : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />新增疾病
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((d) => d.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {filtered.map((disease) => (
                  <SortableRow
                    key={disease.id}
                    disease={disease}
                    onEdit={() => openEdit(disease)}
                    onDelete={() => handleDelete(disease.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">沒有找到疾病資料</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
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
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="flex-1 text-sm" placeholder="輸入疾病名稱" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0 text-sm">分類</Label>
              <span className="text-destructive text-xs font-medium">必填*</span>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="flex-1 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="氣喘">氣喘</SelectItem>
                  <SelectItem value="肺阻塞">肺阻塞</SelectItem>
                </SelectContent>
              </Select>
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
*/
