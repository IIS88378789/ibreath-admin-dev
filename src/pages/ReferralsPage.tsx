import { Share2 } from "lucide-react";

export default function ReferralsPage() {
  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">轉介診所管理 &gt; 轉介列表</div>
      <h1 className="text-2xl font-semibold mb-5">轉介診所列表</h1>
      <div className="bg-card rounded-lg p-12 shadow-sm flex flex-col items-center justify-center text-muted-foreground">
        <Share2 className="h-12 w-12 mb-4" />
        <p>轉介診所管理功能開發中</p>
      </div>
    </div>
  );
}
