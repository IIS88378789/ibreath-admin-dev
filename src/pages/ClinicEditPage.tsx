import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import step1Image from "@/assets/step1-create-channel.png";
import stepFig1 from "@/assets/step-fig1.png";
import stepFig2 from "@/assets/step-fig2.png";
import stepFig3 from "@/assets/step-fig3.png";
import stepFig4 from "@/assets/step-fig4.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchClinic,
  fetchSalesList,
  fetchDiseasesGroupList,
  createClinic,
  updateClinic,
} from "@/api/clinics";

interface FieldRowProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FieldRow({ label, required, hint, children }: FieldRowProps) {
  return (
    <div className="flex items-start py-4 border-b border-border last:border-b-0">
      <div className="w-44 shrink-0 text-sm text-muted-foreground pt-2">{label}</div>
      <div className="flex items-center gap-2 shrink-0">
        {required && (
          <span className="text-xs text-primary border border-primary/50 rounded px-1.5 py-0.5">
            必填*
          </span>
        )}
      </div>
      <div className="flex-1 ml-3">
        {children}
        {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
      </div>
    </div>
  );
}

function ImagePopup({ src, alt, open, onClose }: { src: string; alt: string; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="relative max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-lg p-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg font-bold px-2">✕</button>
        <img src={src} alt={alt} className="w-full rounded" />
      </div>
    </div>
  );
}

function StepGuide() {
  const [popupImg, setPopupImg] = useState<{ src: string; alt: string } | null>(null);

  const figLink = (label: string, src: string) => (
    <button
      type="button"
      onClick={() => setPopupImg({ src, alt: label })}
      className="text-primary underline cursor-pointer bg-transparent border-none p-0 text-sm"
    >
      {label}
    </button>
  );

  return (
    <>
      <ImagePopup
        src={popupImg?.src || ""}
        alt={popupImg?.alt || ""}
        open={!!popupImg}
        onClose={() => setPopupImg(null)}
      />
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-primary mb-2">STEP 1</h3>
          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            <p>
              請先至{" "}
              <a href="https://developers.line.biz/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Line Developer
              </a>{" "}
              建立診所（Providers）的 LINE Login、Messaging API
            </p>
            <p className="text-destructive mt-1">注意：一定要發布上線（Publish this channel）</p>
            <p className="text-muted-foreground mt-1">
              Providers &gt; Create a new channel &gt; LINE Login、Messaging API
            </p>
            <img src={step1Image} alt="Create a new channel" className="mt-3 rounded border border-border w-full" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-primary mb-2">STEP 2</h3>
          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            <p>填寫診所資訊，並且將剛剛已經建立好的 LINE Login、Messaging API 相關內容貼上</p>
            <p className="mt-1">
              {figLink("圖一", stepFig1)}、{figLink("圖二", stepFig2)}、{figLink("圖三", stepFig3)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-primary mb-2">STEP 3</h3>
          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            <p>
              填寫完畢後按下{" "}
              <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">新增</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-primary mb-2">STEP 4</h3>
          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            <p>
              請將畫面顯示的 Web Hook、Line Login Call Back 複製到{" "}
              <a href="https://developers.line.biz/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Line Developer
              </a>{" "}
              中儲存
            </p>
            <p className="mt-1">
              {figLink("圖二", stepFig2)}、{figLink("圖四", stepFig4)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-primary mb-2">STEP 5</h3>
          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            <p>完成新建診所</p>
          </div>
        </div>
      </div>
    </>
  );
}

const defaultForm = {
  name: "",
  isTcma: false,
  saleId: "",
  idNumber: "",
  appointmentUrl: "",
  diseasegroupids: [] as string[],
  lineChannelId: "",
  lineChannelSecret: "",
  lineChannelToken: "",
  lineLoginId: "",
  lineLoginSecret: "",
  webHook: "",
  lineLoginCallBack: "",
  questionnaireURL: "",
};

export default function ClinicEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const clinicId = id ? Number(id) : null;

  const [form, setForm] = useState(defaultForm);
  const [initialized, setInitialized] = useState(false);

  // 業務組別選單
  const { data: salesList = [] } = useQuery({
    queryKey: ["salesList"],
    queryFn: fetchSalesList,
  });

  // 疾病群組選單
  const { data: diseasesGroupList = [] } = useQuery({
    queryKey: ["diseasesGroupList"],
    queryFn: fetchDiseasesGroupList,
  });

  // 載入診所資料（編輯模式）
  const { data: clinicData } = useQuery({
    queryKey: ["clinic", clinicId],
    queryFn: () => fetchClinic(clinicId!),
    enabled: !isNew && clinicId !== null,
  });

  // 當 API 資料回來後初始化表單
  useEffect(() => {
    if (!isNew && clinicData && !initialized) {
      setForm({
        name: clinicData.name ?? "",
        isTcma: clinicData.isTcma ?? false,
        saleId: String(clinicData.saleId ?? ""),
        idNumber: clinicData.idNumber ?? "",
        appointmentUrl: clinicData.reserveUrl ?? "",
        diseasegroupids: clinicData.diseasegroupItems
          .filter((d) => d.selected)
          .map((d) => d.value),
        lineChannelId: clinicData.lineChannelId ?? "",
        lineChannelSecret: clinicData.lineChannelSecret ?? "",
        lineChannelToken: clinicData.lineChannelToken ?? "",
        lineLoginId: clinicData.lineLoginId ?? "",
        lineLoginSecret: clinicData.lineLoginSecret ?? "",
        webHook: clinicData.webHook ?? "",
        lineLoginCallBack: clinicData.lineLoginCallBack ?? "",
        questionnaireURL: clinicData.questionnaireURL ?? "",
      });
      setInitialized(true);
    }
  }, [clinicData, isNew, initialized]);

  const createMutation = useMutation({
    mutationFn: createClinic,
    onSuccess: () => {
      toast.success("已新增診所");
      navigate("/clinics");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateClinic,
    onSuccess: () => {
      toast.success("已儲存變更");
      navigate("/clinics");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDisease = (value: string) => {
    setForm((prev) => {
      const current = prev.diseasegroupids;
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, diseasegroupids: next };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已複製網址");
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("請輸入診所名稱");
      return;
    }
    if (!form.saleId) {
      toast.error("請選擇業務組別");
      return;
    }

    if (isNew) {
      createMutation.mutate({
        IsTcma: form.isTcma,
        Name: form.name.trim(),
        IdNumber: form.idNumber.trim(),
        SaleId: Number(form.saleId),
        LineChannelId: form.lineChannelId.trim(),
        LineChannelSecret: form.lineChannelSecret.trim(),
        LineLoginId: form.lineLoginId.trim(),
        LineLoginSecret: form.lineLoginSecret.trim(),
        LineChannelToken: form.lineChannelToken.trim(),
        Diseasegroupids: form.diseasegroupids,
      });
    } else {
      updateMutation.mutate({
        Id: clinicId!,
        IsTcma: form.isTcma,
        Name: form.name.trim(),
        IdNumber: form.idNumber.trim(),
        SaleId: Number(form.saleId),
        LineChannelId: form.lineChannelId.trim(),
        LineChannelSecret: form.lineChannelSecret.trim(),
        LineLoginId: form.lineLoginId.trim(),
        LineLoginSecret: form.lineLoginSecret.trim(),
        LineChannelToken: form.lineChannelToken.trim(),
        Diseasegroupids: form.diseasegroupids,
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // 決定疾病列表顯示來源：編輯模式用 API 回傳的 diseasegroupItems（含 selected 狀態），
  // 新增模式用 diseasesGroupList
  const diseaseOptions = !isNew && clinicData
    ? clinicData.diseasegroupItems
    : diseasesGroupList;

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        診所管理 &gt; 診所列表 &gt; {isNew ? "新增診所" : "編輯診所"}
      </div>
      <h1 className="text-2xl font-semibold mb-5">
        {isNew ? "新增診所" : "編輯診所"}
      </h1>

      <div className="flex gap-6 items-start">
        {isNew && (
          <div className="w-[420px] shrink-0">
            <StepGuide />
          </div>
        )}

        <div className={`bg-card rounded-lg shadow-sm p-6 ${isNew ? "flex-1" : "max-w-3xl mx-auto w-full"}`}>
          <h2 className="text-lg font-semibold mb-2">診所資訊</h2>

          <FieldRow label="診所名稱" required>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow label="是否為台中醫師公會" required>
            <RadioGroup
              value={form.isTcma ? "yes" : "no"}
              onValueChange={(v) => update("isTcma", v === "yes")}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="assoc-yes" />
                <Label htmlFor="assoc-yes" className="text-sm">是</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="assoc-no" />
                <Label htmlFor="assoc-no" className="text-sm">否</Label>
              </div>
            </RadioGroup>
          </FieldRow>

          <FieldRow label="業務組別" required>
            <Select value={form.saleId} onValueChange={(v) => update("saleId", v)}>
              <SelectTrigger className="bg-muted/50 text-sm">
                <SelectValue placeholder="請選擇" />
              </SelectTrigger>
              <SelectContent>
                {salesList.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>

          <FieldRow label="醫事機構代碼" required>
            <Input
              value={form.idNumber}
              onChange={(e) => update("idNumber", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow label="疾病別" required>
            <div className="flex flex-wrap gap-4">
              {diseaseOptions.map((d) => (
                <div key={d.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`disease-${d.value}`}
                    checked={form.diseasegroupids.includes(d.value)}
                    onCheckedChange={() => toggleDisease(d.value)}
                  />
                  <Label htmlFor={`disease-${d.value}`} className="text-sm cursor-pointer">
                    {d.text}
                  </Label>
                </div>
              ))}
            </div>
          </FieldRow>

          <FieldRow
            label="Line Channel ID"
            required
            hint="圖一：Messaging API > Basic settings (Tab) > Channel ID (複製後貼至此欄位)"
          >
            <Input
              value={form.lineChannelId}
              onChange={(e) => update("lineChannelId", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow
            label="Line Channel Secret"
            required
            hint="圖一：Messaging API > Basic settings (Tab) > Channel secret (複製後貼至此欄位)"
          >
            <Input
              value={form.lineChannelSecret}
              onChange={(e) => update("lineChannelSecret", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow
            label="Line Channel Token"
            required
            hint="圖二：Messaging API > Messaging API (Tab) > Channel access token (複製後貼至此欄位)"
          >
            <Input
              value={form.lineChannelToken}
              onChange={(e) => update("lineChannelToken", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow
            label="Line Login ID"
            required
            hint="圖三：LINE Login > Basic settings (Tab) > Channel ID (複製後貼至此欄位)"
          >
            <Input
              value={form.lineLoginId}
              onChange={(e) => update("lineLoginId", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow
            label="Line Login Secret"
            required
            hint="圖三：LINE Login > Basic settings (Tab) > Channel secret (複製後貼至此欄位)"
          >
            <Input
              value={form.lineLoginSecret}
              onChange={(e) => update("lineLoginSecret", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          {/* 唯讀欄位，只在編輯模式顯示 */}
          {!isNew && (
            <>
              <FieldRow label="Web Hook">
                <div className="flex items-center gap-2">
                  <Input value={form.webHook} readOnly className="bg-muted/50 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.webHook)} className="text-sm shrink-0">
                    複製網址
                  </Button>
                </div>
              </FieldRow>

              <FieldRow label="Line Login Call Back">
                <div className="flex items-center gap-2">
                  <Input value={form.lineLoginCallBack} readOnly className="bg-muted/50 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.lineLoginCallBack)} className="text-sm shrink-0">
                    複製網址
                  </Button>
                </div>
              </FieldRow>

              <FieldRow label="問卷網址">
                <div className="flex items-center gap-2">
                  <Input value={form.questionnaireURL} readOnly className="bg-muted/50 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.questionnaireURL)} className="text-sm shrink-0">
                    複製網址
                  </Button>
                </div>
              </FieldRow>
            </>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={handleSave} className="px-8" disabled={isSaving}>
              {isSaving ? "儲存中..." : isNew ? "新增" : "儲存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
