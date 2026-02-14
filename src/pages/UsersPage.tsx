import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">使用者管理 &gt; 使用者列表</div>
      <h1 className="text-2xl font-semibold mb-5">使用者列表</h1>
      <div className="bg-card rounded-lg p-12 shadow-sm flex flex-col items-center justify-center text-muted-foreground">
        <Users className="h-12 w-12 mb-4" />
        <p>使用者管理功能開發中</p>
      </div>
    </div>
  );
}
