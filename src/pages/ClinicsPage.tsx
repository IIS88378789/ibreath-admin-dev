import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchClinicList, deleteClinic } from "@/api/clinics";

const PAGE_SIZE = 10;

export default function ClinicsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics", submittedSearch],
    queryFn: () => fetchClinicList(submittedSearch || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClinic,
    onSuccess: () => {
      toast.success("已刪除診所");
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const totalPages = Math.max(1, Math.ceil(clinics.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(
    () => clinics.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [clinics, safePage]
  );

  const handleSearch = () => {
    setCurrentPage(1);
    setSubmittedSearch(search);
  };

  const handleReset = () => {
    setSearch("");
    setSubmittedSearch("");
    setCurrentPage(1);
  };

  // 產生頁碼陣列（含省略號），與 POC 相同邏輯
  const pageItems = useMemo(() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2
    );
    return nums.reduce<(number | "...")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);
  }, [totalPages, safePage]);

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
          <Button variant="outline" size="sm" onClick={() => navigate("/clinics/new")} className="text-[14px]">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  載入中...
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  沒有找到診所
                </TableCell>
              </TableRow>
            ) : (
              paged.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium text-sm text-foreground">{clinic.name}</TableCell>
                  <TableCell className="text-sm text-foreground">{clinic.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/clinics/${clinic.id}/edit`)}
                        className="text-[13px]"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        編輯
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(clinic.id)}
                        disabled={deleteMutation.isPending}
                        className="text-[13px]"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        刪除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              第 {safePage} 頁，共 {totalPages} 頁（{clinics.length} 筆）
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={safePage === 1}>«</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>‹</Button>
              {pageItems.map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">…</span>
                ) : (
                  <Button
                    key={p}
                    variant={p === safePage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(p as number)}
                  >
                    {p}
                  </Button>
                )
              )}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages}>»</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
