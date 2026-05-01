import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, RotateCcw, Plus, Pencil, X, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import { fetchUserList, toggleUserStatus, deleteUser, UserListRequest } from "@/api/users";
import { fetchClinicList } from "@/api/clinics";

// orderby: 0 使用者名稱/1診所名稱/2使用者職稱/3使用者身份/4使用者帳號/5啟用狀態
type SortKey = "name" | "clinicName" | "title" | "role" | "account" | "enabled";

const sortableColumns: { key: SortKey; label: string; orderby: number }[] = [
  { key: "name", label: "使用者名稱", orderby: 0 },
  { key: "clinicName", label: "診所名稱", orderby: 1 },
  { key: "title", label: "使用者職稱", orderby: 2 },
  { key: "role", label: "使用者身份", orderby: 3 },
  { key: "account", label: "使用者帳號", orderby: 4 },
  { key: "enabled", label: "啟用狀態", orderby: 5 },
];

export default function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 搜尋表單暫存（未送出前不影響 query）
  const [searchName, setSearchName] = useState("");
  const [searchRoleid, setSearchRoleid] = useState("all");
  const [searchClinicid, setSearchClinicid] = useState("all");

  // 已送出的搜尋參數（觸發 query）
  const [queryParams, setQueryParams] = useState<UserListRequest>({
    page: 1,
    pagesize: 20,
  });

  // sort 狀態
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDesc, setSortDesc] = useState(false);

  // 使用者列表
  const { data, isLoading } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => fetchUserList(queryParams),
  });

  const users = data?.userList ?? [];
  const totalPages = data?.totalPages ?? 1;
  const userCount = data?.userCount ?? 0;
  const currentPage = queryParams.page ?? 1;
  const pageSize = queryParams.pagesize ?? 20;

  // 診所選單
  const { data: clinics = [] } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => fetchClinicList(),
  });

  // 啟用狀態切換
  const toggleMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // 刪除使用者
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("已刪除使用者");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSearch = () => {
    const params: UserListRequest = {
      page: 1,
      pagesize: pageSize,
    };
    if (searchName.trim()) params.username = searchName.trim();
    if (searchRoleid !== "all") params.roleid = Number(searchRoleid);
    if (searchClinicid !== "all") params.clinicid = Number(searchClinicid);
    if (sortKey !== null) {
      const col = sortableColumns.find((c) => c.key === sortKey);
      if (col) {
        params.orderby = col.orderby;
        params.desc = sortDesc;
      }
    }
    setQueryParams(params);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchRoleid("all");
    setSearchClinicid("all");
    setSortKey(null);
    setSortDesc(false);
    setQueryParams({ page: 1, pagesize: pageSize });
  };

  const handleSort = (key: SortKey) => {
    const col = sortableColumns.find((c) => c.key === key)!;
    let newDesc = false;
    let newKey: SortKey | null = key;

    if (sortKey === key) {
      if (!sortDesc) {
        newDesc = true;
      } else {
        newKey = null;
        newDesc = false;
      }
    }

    setSortKey(newKey);
    setSortDesc(newDesc);

    setQueryParams((prev) => {
      const next: UserListRequest = { ...prev, page: 1 };
      if (newKey) {
        next.orderby = col.orderby;
        next.desc = newDesc;
      } else {
        delete next.orderby;
        delete next.desc;
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: string) => {
    setQueryParams((prev) => ({ ...prev, pagesize: Number(size), page: 1 }));
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
    return sortDesc ? <ArrowDown className="h-3.5 w-3.5 ml-1" /> : <ArrowUp className="h-3.5 w-3.5 ml-1" />;
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">使用者管理 &gt; 使用者列表</div>
      <h1 className="text-2xl font-semibold mb-5">使用者列表</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <Label className="text-[14px] font-medium mb-2 block">使用者名稱</Label>
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-44 text-[14px]"
              placeholder="輸入名稱"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-2 block">使用者身份</Label>
            <Select value={searchRoleid} onValueChange={setSearchRoleid}>
              <SelectTrigger className="w-36 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">---</SelectItem>
                <SelectItem value="1">管理者</SelectItem>
                <SelectItem value="2">診所</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-2 block">診所別</Label>
            <Select value={searchClinicid} onValueChange={setSearchClinicid}>
              <SelectTrigger className="w-44 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">---</SelectItem>
                {clinics.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} size="sm" className="text-[14px]">
            <Search className="h-4 w-4 mr-1" />
            搜尋
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm" className="text-[14px]">
            <RotateCcw className="h-4 w-4 mr-1" />
            重置
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/users/new")}>
            <Plus className="h-4 w-4 mr-1" />
            新增使用者
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {sortableColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-sm text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    <SortIcon column={col.key} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  載入中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  沒有找到使用者
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-sm font-medium">{user.name}</TableCell>
                  <TableCell className="text-sm">{user.clinicname}</TableCell>
                  <TableCell className="text-sm">{user.jobTitle}</TableCell>
                  <TableCell className="text-sm">{user.rolename}</TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status}
                      onCheckedChange={() => toggleMutation.mutate(user.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" className="text-[13px]" onClick={() => navigate(`/users/${user.id}/edit`)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        編輯
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-[13px]"
                        onClick={() => deleteMutation.mutate(user.id)}
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>每頁顯示</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>筆，共 {userCount} 筆</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
