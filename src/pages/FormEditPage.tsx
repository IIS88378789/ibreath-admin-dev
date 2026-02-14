import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDiseaseDocumentStore, type FormField, type DiseaseDocument } from "@/stores/diseaseDocumentStore";
import { useDiseaseStore } from "@/stores/diseaseStore";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";

const fieldTypes = ["文字", "數字", "單選", "多選", "日期", "下拉選單", "文字區域"];

export default function FormEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const isEditing = editingId !== null;

  const { documents, addDocument, updateDocument } = useDiseaseDocumentStore();
  const { diseases } = useDiseaseStore();
  const diseaseNames = diseases.map((d) => d.name);

  const [formName, setFormName] = useState("");
  const [formDisease, setFormDisease] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [nextFieldId, setNextFieldId] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (isEditing && !initialized) {
      const doc = documents.find((d) => d.id === editingId);
      if (doc) {
        setFormName(doc.name);
        setFormDisease(doc.disease);
        setFormFields([...doc.fields]);
        setNextFieldId(
          doc.fields.length > 0 ? Math.max(...doc.fields.map((f) => f.id)) + 1 : 1
        );
        setInitialized(true);
      } else {
        toast.error("找不到該表單");
        navigate("/disease-forms");
      }
    }
  }, [isEditing, editingId, documents, initialized, navigate]);

  const addField = () => {
    setFormFields((prev) => [
      ...prev,
      { id: nextFieldId, name: "", type: "文字", description: "" },
    ]);
    setNextFieldId((prev) => prev + 1);
  };

  const updateField = (id: number, key: keyof FormField, value: string) => {
    setFormFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: number) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const buildPreviewDoc = (): DiseaseDocument => ({
    id: editingId ?? 0,
    name: formName || "（未命名）",
    disease: formDisease || "（未選擇）",
    category: "表單",
    fields: formFields,
    createdAt: "",
  });

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("請填寫表單名稱");
      return;
    }
    if (formFields.length === 0) {
      toast.error("請至少新增一個欄位");
      return;
    }
    if (formFields.some((f) => !f.name.trim())) {
      toast.error("欄位名稱不可為空");
      return;
    }

    if (isEditing) {
      updateDocument(editingId!, {
        name: formName.trim(),
        disease: formDisease,
        fields: formFields,
      });
      toast.success("已更新表單");
    } else {
      addDocument({
        name: formName.trim(),
        disease: formDisease,
        category: "表單",
        fields: formFields,
      });
      toast.success("已新增表單");
    }
    navigate("/disease-forms");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        疾病管理 &gt; 疾病相關表單 &gt; {isEditing ? "編輯表單" : "新增表單"}
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
        <h1 className="text-2xl font-semibold">{isEditing ? "編輯表單" : "新增表單"}</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* 基本資訊 */}
        <div className="bg-card rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-base font-medium">基本資訊</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">
                表單名稱 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-sm"
                placeholder="輸入表單名稱"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">
                關聯病症 <span className="text-destructive">*</span>
              </Label>
              <Select value={formDisease} onValueChange={setFormDisease}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="選擇病症" />
                </SelectTrigger>
                <SelectContent>
                  {diseaseNames.map((d) => (
                    <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 自訂欄位 */}
        <div className="bg-card rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">自訂欄位</h2>
            <Button variant="outline" size="sm" className="text-[13px]" onClick={addField}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增欄位
            </Button>
          </div>

          {formFields.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
              尚未新增任何欄位，請點擊「新增欄位」
            </div>
          )}

          <div className="space-y-3">
            {formFields.map((field, idx) => (
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
                    <Label className="text-xs text-muted-foreground">欄位名稱 *</Label>
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(field.id, "name", e.target.value)}
                      className="text-sm h-8"
                      placeholder="例：症狀頻率"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">欄位類型</Label>
                    <Select
                      value={field.type}
                      onValueChange={(v) => updateField(field.id, "type", v)}
                    >
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((t) => (
                          <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">說明</Label>
                  <Textarea
                    value={field.description}
                    onChange={(e) => updateField(field.id, "description", e.target.value)}
                    className="text-sm min-h-[60px] resize-none"
                    placeholder="欄位說明（選填）"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/disease-forms")}>
            取消
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-3.5 w-3.5 mr-1" />
            預覽
          </Button>
          <Button size="sm" onClick={handleSave}>
            儲存
          </Button>
        </div>
      </div>

      <DocumentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        document={previewOpen ? buildPreviewDoc() : null}
      />
    </div>
  );
}
