import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RotateCcw, Plus, Pencil, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useInhalerStore, type Inhaler } from "@/stores/inhalerStore";
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
  inhaler: Inhaler;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableRow({ inhaler, onEdit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: inhaler.id,
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
          {inhaler.order}
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium">{inhaler.name}</TableCell>
      <TableCell className="text-sm">{inhaler.category}</TableCell>
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

export default function InhalersPage() {
  const navigate = useNavigate();
  const { inhalers, categories, deleteInhaler, reorderInhalers } = useInhalerStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const sorted = [...inhalers].sort((a, b) => a.order - b.order);
  const filtered = sorted
    .filter((i) => (categoryFilter === "all" || i.category === categoryFilter))
    .filter((i) => i.name.includes(search));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((i) => i.id === active.id);
    const newIndex = sorted.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    reorderInhalers(reordered.map((i) => i.id));
    toast.success("已更新排序");
  };

  const handleSearch = () => {};
  const handleReset = () => {
    setSearch("");
    setCategoryFilter("all");
  };

  const handleDelete = (id: number) => {
    deleteInhaler(id);
    toast.success("已刪除吸入器");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">吸入器管理 &gt; 吸入器列表</div>
      <h1 className="text-2xl font-semibold mb-5">吸入器列表</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <Label className="text-[14px] font-medium mb-2 block">吸入器名稱</Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 text-[14px]"
              placeholder="輸入吸入器名稱"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-2 block">吸入器分類</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[14px]">全部</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name} className="text-[14px]">{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 pt-6">
            <Button onClick={handleSearch} size="sm" className="text-[14px]">
              <Search className="h-4 w-4 mr-1" />搜尋
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm" className="text-[14px]">
              <RotateCcw className="h-4 w-4 mr-1" />重置
            </Button>
          </div>
          <div className="flex-1" />
          <div className="pt-6">
            <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/inhalers/new")}>
              <Plus className="h-4 w-4 mr-1" />新增吸入器
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">排序</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">吸入器名稱</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">分類</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {filtered.map((inhaler) => (
                  <SortableRow
                    key={inhaler.id}
                    inhaler={inhaler}
                    onEdit={() => navigate(`/inhalers/${inhaler.id}/edit`)}
                    onDelete={() => handleDelete(inhaler.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">沒有找到吸入器</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </div>
    </div>
  );
}
