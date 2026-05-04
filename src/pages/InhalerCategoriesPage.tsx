import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, X, GripVertical } from "lucide-react";
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
import {
  fetchInhalerCategoryList,
  createInhalerCategory,
  updateInhalerCategory,
  deleteInhalerCategory,
  InhalerCategoryItem,
} from "@/api/inhalers";
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

interface SortableRowProps {
  category: InhalerCategoryItem;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableRow({ category, onEdit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
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
          {category.sort}
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium">{category.name}</TableCell>
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

export default function InhalerCategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<InhalerCategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSort, setFormSort] = useState("");
  const [localOrder, setLocalOrder] = useState<number[] | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["inhaler-categories"],
    queryFn: fetchInhalerCategoryList,
    select: (data) => [...data].sort((a, b) => a.sort - b.sort),
  });

  const sorted = localOrder
    ? localOrder.map((id) => categories.find((c) => c.id === id)!).filter(Boolean)
    : categories;

  const createMutation = useMutation({
    mutationFn: createInhalerCategory,
    onSuccess: () => {
      toast.success("已新增分類");
      queryClient.invalidateQueries({ queryKey: ["inhaler-categories"] });
      setLocalOrder(null);
      setDialogOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateInhalerCategory,
    onSuccess: () => {
      toast.success("已更新分類");
      queryClient.invalidateQueries({ queryKey: ["inhaler-categories"] });
      setLocalOrder(null);
      setDialogOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInhalerCategory,
    onSuccess: () => {
      toast.success("已刪除分類");
      queryClient.invalidateQueries({ queryKey: ["inhaler-categories"] });
      setLocalOrder(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSort("");
    setDialogOpen(true);
  };

  const openEdit = (cat: InhalerCategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSort(String(cat.sort));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formSort.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }
    if (editingCategory !== null) {
      updateMutation.mutate({ id: editingCategory.id, name: formName.trim(), sort: Number(formSort) });
    } else {
      createMutation.mutate({ name: formName.trim(), sort: Number(formSort) });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((c) => c.id === active.id);
    const newIndex = sorted.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    setLocalOrder(reordered.map((c) => c.id));
    toast.success("已更新排序");
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sorted.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">載入中...</TableCell>
                  </TableRow>
                ) : sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">沒有找到分類資料</TableCell>
                  </TableRow>
                ) : (
                  sorted.map((cat) => (
                    <SortableRow
                      key={cat.id}
                      category={cat}
                      onEdit={() => openEdit(cat)}
                      onDelete={() => deleteMutation.mutate(cat.id)}
                    />
                  ))
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory !== null ? "編輯分類" : "新增分類"}</DialogTitle>
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
              <Input type="number" value={formSort} onChange={(e) => setFormSort(e.target.value)} className="flex-1 text-sm" placeholder="輸入排序" />
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={handleSave} disabled={isSaving}>儲存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
