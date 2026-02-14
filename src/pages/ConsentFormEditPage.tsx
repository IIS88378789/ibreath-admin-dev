import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const diseases = ["氣喘", "慢性阻塞性肺病", "過敏性氣喘", "肺氣腫", "慢性支氣管炎"];

interface SignatureField {
  id: number;
  name: string;
  type: "input" | "checkbox";
  description: string;
}

export default function ConsentFormEditPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [disease, setDisease] = useState(diseases[0]);
  const [content, setContent] = useState("");
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [nextFieldId, setNextFieldId] = useState(1);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      { id: nextFieldId, name: "", type: "input", description: "" },
    ]);
    setNextFieldId((prev) => prev + 1);
  };

  const updateField = (id: number, key: keyof SignatureField, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("請填寫同意書名稱");
      return;
    }
    if (!content.trim()) {
      toast.error("請填寫同意書內容");
      return;
    }
    if (fields.length === 0) {
      toast.error("請至少新增一個簽名欄位");
      return;
    }
    if (fields.some((f) => !f.name.trim())) {
      toast.error("欄位名稱不可為空");
      return;
    }
    toast.success("已儲存同意書");
    navigate("/disease-forms");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        疾病管理 &gt; 疾病相關表單 &gt; 新增同意書
      </div>
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/disease-forms")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">新增同意書</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* 基本資訊 */}
        <div className="bg-card rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-base font-medium">基本資訊</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">
                同意書名稱 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm"
                placeholder="輸入同意書名稱"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">
                關聯病症 <span className="text-destructive">*</span>
              </Label>
              <Select value={disease} onValueChange={setDisease}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diseases.map((d) => (
                    <SelectItem key={d} value={d} className="text-sm">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 同意書內容 */}
        <div className="bg-card rounded-lg p-5 shadow-sm space-y-3">
          <h2 className="text-base font-medium">
            同意書內容 <span className="text-destructive">*</span>
          </h2>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-sm min-h-[240px]"
            placeholder="請輸入同意書的詳細內容..."
          />
        </div>

        {/* 簽名欄位 */}
        <div className="bg-card rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">簽名欄位</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-[13px]"
              onClick={addField}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增欄位
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
              尚未新增任何簽名欄位，請點擊「新增欄位」
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="border rounded-md p-3 bg-muted/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    欄位 {idx + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeField(field.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      欄位名稱 *
                    </Label>
                    <Input
                      value={field.name}
                      onChange={(e) =>
                        updateField(field.id, "name", e.target.value)
                      }
                      className="text-sm h-8"
                      placeholder="例：病患簽名"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      欄位類型
                    </Label>
                    <Select
                      value={field.type}
                      onValueChange={(v) => updateField(field.id, "type", v)}
                    >
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="input" className="text-sm">
                          文字輸入
                        </SelectItem>
                        <SelectItem value="checkbox" className="text-sm">
                          勾選框
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">說明</Label>
                  <Input
                    value={field.description}
                    onChange={(e) =>
                      updateField(field.id, "description", e.target.value)
                    }
                    className="text-sm h-8"
                    placeholder="欄位說明（選填）"
                  />
                </div>

                {/* 預覽 */}
                <div className="pt-1 border-t mt-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    預覽
                  </Label>
                  {field.type === "checkbox" ? (
                    <div className="flex items-center gap-2">
                      <Checkbox disabled />
                      <span className="text-sm text-muted-foreground">
                        {field.name || "欄位名稱"}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-sm text-muted-foreground">
                        {field.name || "欄位名稱"}
                      </span>
                      <Input disabled className="text-sm h-8 max-w-xs" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/disease-forms")}
          >
            取消
          </Button>
          <Button size="sm" onClick={handleSave}>
            儲存
          </Button>
        </div>
      </div>
    </div>
  );
}
