import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

interface User {
  id: number;
  name: string;
  clinicName: string;
  title: string;
  role: string;
  account: string;
  enabled: boolean;
}

const initialUsers: User[] = [
  { id: 1, name: "CodingIT Admin", clinicName: "", title: "Admin", role: "管理者", account: "service@codingit.tw", enabled: true },
  { id: 2, name: "Admin", clinicName: "", title: "Admin", role: "管理者", account: "vivien5513745@gmail.com", enabled: false },
  { id: 3, name: "Admin", clinicName: "", title: "Admin", role: "管理者", account: "shuo6878@gmail.com", enabled: false },
  { id: 4, name: "Admin", clinicName: "", title: "Admin", role: "管理者", account: "ibreath1063@gmail.com", enabled: true },
  { id: 5, name: "愛而生", clinicName: "健康呼吸", title: "測試", role: "診所", account: "service.ibreath@gmail.com", enabled: true },
  { id: 6, name: "測試", clinicName: "中崙國際診所", title: "醫師", role: "診所", account: "ybeei740317@gmail.com", enabled: true },
];

type SortKey = "name" | "clinicName" | "title" | "role" | "account" | "enabled";
type SortDir = "asc" | "desc" | null;

const sortableColumns: { key: SortKey; label: string }[] = [
  { key: "name", label: "使用者名稱" },
  { key: "clinicName", label: "診所名稱" },
  { key: "title", label: "使用者職稱" },
  { key: "role", label: "使用者身份" },
  { key: "account", label: "使用者帳號" },
  { key: "enabled", label: "啟用狀態" },
];

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filtered, setFiltered] = useState<User[]>(initialUsers);
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("all");
  const [searchClinic, setSearchClinic] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    let result = users;
    if (searchName) result = result.filter((u) => u.name.includes(searchName));
    if (searchRole !== "all") result = result.filter((u) => u.role === searchRole);
    if (searchClinic !== "all") result = result.filter((u) => u.clinicName === searchClinic);
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchRole("all");
    setSearchClinic("all");
    setFiltered(users);
    setSortKey(null);
    setSortDir(null);
    setCurrentPage(1);
  };

  const toggleEnabled = (id: number) => {
    const updated = users.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u));
    setUsers(updated);
    setFiltered((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));
  };

  const handleDelete = (id: number) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    setFiltered((prev) => prev.filter((u) => u.id !== id));
    toast.success("已刪除使用者");
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortDir === "asc" ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const cmp = aStr.localeCompare(bStr, "zh-Hant");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clinicNames = [...new Set(users.map((u) => u.clinicName).filter(Boolean))];

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column || !sortDir) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5 ml-1" /> : <ArrowDown className="h-3.5 w-3.5 ml-1" />;
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
            <Select value={searchRole} onValueChange={setSearchRole}>
              <SelectTrigger className="w-36 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">---</SelectItem>
                <SelectItem value="管理者">管理者</SelectItem>
                <SelectItem value="診所">診所</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-2 block">診所別</Label>
            <Select value={searchClinic} onValueChange={setSearchClinic}>
              <SelectTrigger className="w-44 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">---</SelectItem>
                {clinicNames.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
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
            {paged.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-sm font-medium">{user.name}</TableCell>
                <TableCell className="text-sm">{user.clinicName}</TableCell>
                <TableCell className="text-sm">{user.title}</TableCell>
                <TableCell className="text-sm">{user.role}</TableCell>
                <TableCell className="text-sm">{user.account}</TableCell>
                <TableCell>
                  <Switch checked={user.enabled} onCheckedChange={() => toggleEnabled(user.id)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" className="text-[13px]" onClick={() => navigate(`/users/${user.id}/edit`)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      編輯
                    </Button>
                    <Button size="sm" variant="destructive" className="text-[13px]" onClick={() => handleDelete(user.id)}>
                      <X className="h-3.5 w-3.5 mr-1" />
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  沒有找到使用者
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>每頁顯示</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>筆，共 {sorted.length} 筆</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
