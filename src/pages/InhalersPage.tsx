import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RotateCcw, Plus, Pencil, X } from "lucide-react";
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
import { toast } from "sonner";
import inhalerPurple from "@/assets/inhaler-purple.png";
import inhalerPink from "@/assets/inhaler-pink.png";
import inhalerBlue from "@/assets/inhaler-blue.png";
import inhalerRed from "@/assets/inhaler-red.png";
import inhalerWhite from "@/assets/inhaler-white.png";
import inhalerOrange from "@/assets/inhaler-orange.png";

interface Inhaler {
  id: number;
  order: number;
  image: string;
  name: string;
}

const initialInhalers: Inhaler[] = [
  { id: 1, order: 1, image: inhalerPurple, name: "使肺泰 Seretide" },
  { id: 2, order: 2, image: inhalerPink, name: "肺舒坦 Foster" },
  { id: 3, order: 3, image: inhalerBlue, name: "潤娃易利達 Relvar" },
  { id: 4, order: 5, image: inhalerRed, name: "吸必擴 Rapihaler" },
  { id: 5, order: 6, image: inhalerWhite, name: "舒利迭 Symbicort" },
  { id: 6, order: 7, image: inhalerOrange, name: "倍樂 Berodual" },
];

export default function InhalersPage() {
  const navigate = useNavigate();
  const [inhalers, setInhalers] = useState<Inhaler[]>(initialInhalers);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Inhaler[]>(initialInhalers);

  const handleSearch = () => {
    const result = inhalers.filter((i) => i.name.includes(search));
    setFiltered(result);
  };

  const handleReset = () => {
    setSearch("");
    setFiltered(inhalers);
  };

  const handleDelete = (id: number) => {
    const updated = inhalers.filter((i) => i.id !== id);
    setInhalers(updated);
    setFiltered(updated.filter((i) => i.name.includes(search)));
    toast.success("已刪除吸入器");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        吸入器管理 &gt; 吸入器列表
      </div>
      <h1 className="text-2xl font-semibold mb-5">吸入器列表</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <Label className="text-[14px] font-medium mb-2 block">吸入器名稱</Label>
        <div className="flex items-center gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs text-[14px]"
            placeholder="輸入吸入器名稱"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm" className="text-[14px]">
            <Search className="h-4 w-4 mr-1" />
            搜尋
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm" className="text-[14px]">
            <RotateCcw className="h-4 w-4 mr-1" />
            重置
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/inhalers/new")}>
            <Plus className="h-4 w-4 mr-1" />
            新增吸入器
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">排序</TableHead>
              <TableHead className="w-24 text-sm text-muted-foreground font-medium">圖片</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">吸入器名稱</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inhaler) => (
              <TableRow key={inhaler.id}>
                <TableCell className="text-sm text-center">{inhaler.order}</TableCell>
                <TableCell className="text-center"><img src={inhaler.image} alt={inhaler.name} className="h-12 w-12 object-contain inline-block" /></TableCell>
                <TableCell className="text-sm font-medium">{inhaler.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" className="text-[13px]" onClick={() => navigate(`/inhalers/${inhaler.id}/edit`)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(inhaler.id)}
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
                  沒有找到吸入器
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
