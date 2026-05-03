import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchReferralList, createReferral, updateReferral, ReferralListItem } from "@/api/referrals";

export default function ReferralsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState<string | undefined>(undefined);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formSort, setFormSort] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["referrals", submittedSearch],
    queryFn: () => fetchReferralList(submittedSearch),
  });

  const referrals = data?.referralList ?? [];

  const createMutation = useMutation({
    mutationFn: createReferral,
    onSuccess: () => {
      toast.success("已新增轉介診所");
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      setDialogOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateReferral,
    onSuccess: () => {
      toast.success("已更新轉介診所");
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      setDialogOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSearch = () => {
    setSubmittedSearch(search.trim() || undefined);
  };

  const handleReset = () => {
    setSearch("");
    setSubmittedSearch(undefined);
  };

  const handleDelete = (_id: number) => {
    toast.success("已刪除轉介診所");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormSort("");
    setDialogOpen(true);
  };

  const openEdit = (referral: ReferralListItem) => {
    setEditingId(referral.id);
    setFormName(referral.name);
    setFormSort(String(referral.sort));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formSort.trim()) {
      toast.error("請填寫必填欄位");
      return;
    }

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, Name: formName.trim(), sort: formSort.trim() });
    } else {
      createMutation.mutate({ Name: formName.trim(), sort: formSort.trim() });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  載入中...
                </TableCell>
              </TableRow>
            ) : referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  沒有找到轉介診所
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="text-sm text-center">{referral.sort}</TableCell>
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
              ))
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
                value={formSort}
                onChange={(e) => setFormSort(e.target.value)}
                className="flex-1 text-sm"
                placeholder="輸入排序"
              />
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
