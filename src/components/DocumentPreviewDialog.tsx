import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DiseaseDocument } from "@/stores/diseaseDocumentStore";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DiseaseDocument | null;
}

export default function DocumentPreviewDialog({
  open,
  onOpenChange,
  document: doc,
}: DocumentPreviewDialogProps) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>預覽：{doc.name}</span>
            <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded">
              {doc.category}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* 基本資訊 */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">文件名稱：</span>
                <span className="font-medium">{doc.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">關聯病症：</span>
                <span className="font-medium">{doc.disease}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 同意書內容 */}
          {doc.category === "同意書" && doc.content && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-3">同意書內容</h3>
                <div
                  className="prose prose-sm max-w-none border rounded-md p-4 bg-muted/20 text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_p]:my-1"
                  dangerouslySetInnerHTML={{ __html: doc.content }}
                />
              </div>
              <Separator />
            </>
          )}

          {/* 欄位預覽 */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              {doc.category === "同意書" ? "簽名欄位" : "表單欄位"}
            </h3>
            {doc.fields.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                無欄位
              </div>
            ) : (
              <div className="space-y-4">
                {doc.fields.map((field, idx) => (
                  <div key={field.id} className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      {idx + 1}. {field.name}
                      {field.description && (
                        <span className="text-xs text-muted-foreground font-normal ml-2">
                          ({field.description})
                        </span>
                      )}
                    </Label>
                    {renderFieldPreview(field.type)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderFieldPreview(type: string) {
  switch (type) {
    case "勾選框":
      return (
        <div className="flex items-center gap-2">
          <Checkbox disabled />
          <span className="text-sm text-muted-foreground">勾選確認</span>
        </div>
      );
    case "數字":
      return <Input type="number" disabled placeholder="請輸入數字" className="text-sm h-9 max-w-xs" />;
    case "日期":
      return <Input type="date" disabled className="text-sm h-9 max-w-xs" />;
    case "單選":
      return (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <label className="flex items-center gap-1.5"><input type="radio" disabled /> 選項 A</label>
          <label className="flex items-center gap-1.5"><input type="radio" disabled /> 選項 B</label>
          <label className="flex items-center gap-1.5"><input type="radio" disabled /> 選項 C</label>
        </div>
      );
    case "多選":
      return (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <label className="flex items-center gap-1.5"><Checkbox disabled /> 選項 A</label>
          <label className="flex items-center gap-1.5"><Checkbox disabled /> 選項 B</label>
          <label className="flex items-center gap-1.5"><Checkbox disabled /> 選項 C</label>
        </div>
      );
    case "下拉選單":
      return <Input disabled placeholder="請選擇..." className="text-sm h-9 max-w-xs" />;
    case "文字區域":
      return <textarea disabled placeholder="請輸入內容..." className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-background opacity-50" />;
    case "文字輸入":
      return <Input disabled placeholder="請輸入文字" className="text-sm h-9 max-w-xs" />;
    default:
      return <Input disabled placeholder="請輸入文字" className="text-sm h-9 max-w-xs" />;
  }
}
