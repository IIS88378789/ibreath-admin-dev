import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RotateCcw, Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Clinic {
  id: number;
  name: string;
  patientCount: number;
}

const initialClinics: Clinic[] = [
  { id: 1, name: "健康呼吸", patientCount: 116 },
  { id: 2, name: "中崙國際診所", patientCount: 37 },
  { id: 3, name: "關心診所", patientCount: 249 },
  { id: 4, name: "愷馨耳鼻喉科診所", patientCount: 9 },
];

export default function ClinicsPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Clinic[]>(initialClinics);

  const handleSearch = () => {
    const result = clinics.filter((c) => c.name.includes(search));
    setFiltered(result);
  };

  const handleReset = () => {
    setSearch("");
    setFiltered(clinics);
  };

  const handleAdd = () => {
    navigate("/clinics/new");
  };

  const handleEdit = (clinic: Clinic) => {
    navigate(`/clinics/${clinic.id}/edit`);
  };

  const handleDelete = (id: number) => {
    const updated = clinics.filter((c) => c.id !== id);
    setClinics(updated);
    setFiltered(updated.filter((c) => c.name.includes(search)));
    toast.success("已刪除診所");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        診所管理 &gt; 診所列表
      </div>
      <h1 className="text-2xl font-semibold mb-5">診所列表</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <Label className="text-[14px] font-medium mb-2 block">診所名稱</Label>
        <div className="flex items-center gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs text-[14px]"
            placeholder="輸入診所名稱"
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
          <Button variant="outline" size="sm" onClick={handleAdd} className="text-[14px]">
            <Plus className="h-4 w-4 mr-1" />
            新增診所
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] text-sm text-muted-foreground font-medium">診所名稱</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">病患人數</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell className="font-medium text-sm text-foreground">{clinic.name}</TableCell>
                <TableCell className="text-sm text-foreground">{clinic.patientCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" onClick={() => handleEdit(clinic)} className="text-[13px]">
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(clinic.id)}
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
                  沒有找到診所
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
