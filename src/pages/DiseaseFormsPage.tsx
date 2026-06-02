export default function DiseaseFormsPage() {
  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">疾病管理 &gt; 疾病相關表單</div>
      <h1 className="text-2xl font-semibold mb-5">疾病相關表單</h1>
      <p className="text-muted-foreground">功能建置中</p>
    </div>
  );
}

/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, X, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { useDiseaseDocumentStore } from "@/stores/diseaseDocumentStore";
import { useDiseaseStore } from "@/stores/diseaseStore";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import type { DiseaseDocument } from "@/stores/diseaseDocumentStore";

function DiseaseFormsPageFull() {
  const navigate = useNavigate();
  const { documents, deleteDocument } = useDiseaseDocumentStore();
  const { diseases } = useDiseaseStore();
  const diseaseNames = diseases.map((d) => d.name);
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const [previewDoc, setPreviewDoc] = useState<DiseaseDocument | null>(null);

  const filtered =
    diseaseFilter === "all" ? documents : documents.filter((f) => f.disease === diseaseFilter);

  const handleDelete = (id: number) => {
    deleteDocument(id);
    toast.success("已刪除");
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
              {diseaseNames.map((d) => (
                <SelectItem key={d} value={d} className="text-[14px]">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/consent-forms/new")}>
            <FileText className="h-4 w-4 mr-1" />
            新增同意書
          </Button>
          <Button variant="outline" size="sm" className="text-[14px]" onClick={() => navigate("/forms/new")}>
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
                    <Button size="sm" variant="outline" className="text-[13px]" onClick={() => setPreviewDoc(doc)}>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      預覽
                    </Button>
                    {doc.category === "表單" && (
                      <Button size="sm" className="text-[13px]" onClick={() => navigate(`/forms/${doc.id}/edit`)}>
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

      <DocumentPreviewDialog
        open={previewDoc !== null}
        onOpenChange={(open) => { if (!open) setPreviewDoc(null); }}
        document={previewDoc}
      />
    </div>
  );
}
*/
