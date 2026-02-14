import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, X, FileText } from "lucide-react";
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
import { useDiseaseDocumentStore, type FormField } from "@/stores/diseaseDocumentStore";

const fieldTypes = ["文字", "數字", "單選", "多選", "日期", "下拉選單", "文字區域"];
const diseases = ["氣喘", "慢性阻塞性肺病", "過敏性氣喘", "肺氣腫", "慢性支氣管炎"];

export default function DiseaseFormsPage() {
  const navigate = useNavigate();
  const { documents, addDocument, updateDocument, deleteDocument } = useDiseaseDocumentStore();
  const [diseaseFilter, setDiseaseFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formDisease, setFormDisease] = useState(diseases[0]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [nextFieldId, setNextFieldId] = useState(1);

  const filtered =
    diseaseFilter === "all" ? documents : documents.filter((f) => f.disease === diseaseFilter);

  const handleDelete = (id: number) => {
    deleteDocument(id);
    toast.success("已刪除");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormDisease(diseases[0]);
    setFormFields([]);
    setNextFieldId(1);
    setDialogOpen(true);
  };

  const openEdit = (form: { id: number; name: string; disease: string; fields: FormField[] }) => {
    setEditingId(form.id);
    setFormName(form.name);
    setFormDisease(form.disease);
    setFormFields([...form.fields]);
    setNextFieldId(
      form.fields.length > 0 ? Math.max(...form.fields.map((f) => f.id)) + 1 : 1
    );
    setDialogOpen(true);
  };

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

    if (editingId !== null) {
      updateDocument(editingId, {
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
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        疾病管理 &gt; 疾病相關表單
      </div>
      <h1 className="text-2xl font-semibold mb-5">疾病相關表單</h1>

      <div className="bg-card rounded-lg p-5 mb-4 shadow-sm">
        <Label className="text-[14px] font-medium mb-2 block">病症篩選</Label>
        <div className="flex items-center gap-3">
          <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
            <SelectTrigger className="max-w-xs text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[14px]">全部</SelectItem>
              {diseases.map((d) => (
                <SelectItem key={d} value={d} className="text-[14px]">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/consent-forms/new")}>
            <FileText className="h-4 w-4 mr-1" />
            新增同意書
          </Button>
          <Button variant="outline" size="sm" className="text-[14px]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            新增表單
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm text-muted-foreground font-medium">表單名稱</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium">關聯病症</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium w-24 text-center">文件類別</TableHead>
              <TableHead className="text-sm text-muted-foreground font-medium w-28">建立日期</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground font-medium">功能</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-sm font-medium">{doc.name}</TableCell>
                <TableCell className="text-sm">{doc.disease}</TableCell>
                <TableCell className="text-sm text-center">{doc.category}</TableCell>
                <TableCell className="text-sm">{doc.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {doc.category === "表單" && (
                      <Button size="sm" className="text-[13px]" onClick={() => openEdit(doc)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        編輯
                      </Button>
                    )}
                    {doc.category === "同意書" && (
                      <Button size="sm" className="text-[13px]" onClick={() => navigate(`/consent-forms/${doc.id}/edit`)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        編輯
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  沒有找到表單資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "編輯表單" : "新增表單"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {diseases.map((d) => (
                      <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">自訂欄位</Label>
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

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={handleSave}>儲存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
