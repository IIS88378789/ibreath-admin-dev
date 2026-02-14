import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const mockClinics: Record<string, {
  name: string;
  isTaichungAssociation: string;
  businessGroup: string;
  medicalCode: string;
  appointmentUrl: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineChannelToken: string;
  lineLoginId: string;
  lineLoginSecret: string;
  webHook: string;
  lineLoginCallback: string;
  surveyUrl: string;
}> = {
  "1": {
    name: "健康呼吸",
    isTaichungAssociation: "no",
    businessGroup: "taipei",
    medicalCode: "1101100011",
    appointmentUrl: "https://www.mmh.org.tw/register_divide.php?depid=3",
    lineChannelId: "2003809033",
    lineChannelSecret: "05cabeb5741e2c1f6e84f9893b59935f",
    lineChannelToken: "gtCli+Shf6PBg3MMZeEh7b+OKYJwldBVbg8EjMH1wSgccH",
    lineLoginId: "2004385272",
    lineLoginSecret: "9f8a6a1f0d44c492ff91da0652721618",
    webHook: "https://bot.i-breaths.com/api/ebp5hkotd8/webhook",
    lineLoginCallback: "https://bot.i-breaths.com/ebp5hkotd8/callback/line",
    surveyUrl: "https://bot.i-breaths.com/ebp5hkotd8",
  },
};

const defaultForm = {
  name: "",
  isTaichungAssociation: "no",
  businessGroup: "",
  medicalCode: "",
  appointmentUrl: "",
  lineChannelId: "",
  lineChannelSecret: "",
  lineChannelToken: "",
  lineLoginId: "",
  lineLoginSecret: "",
  webHook: "",
  lineLoginCallback: "",
  surveyUrl: "",
};

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

function StepGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-primary mb-2">STEP 1</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
          <p>
            請先至{" "}
            <a
              href="https://developers.line.biz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Line Developer
            </a>{" "}
            建立診所（Providers）的 LINE Login、Messaging API
          </p>
          <p className="text-destructive mt-1">注意：一定要發布上線（Publish this channel）</p>
          <p className="text-muted-foreground mt-1">
            Providers &gt; Create a new channel &gt; LINE Login、Messaging API
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-primary mb-2">STEP 2</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
          <p>填寫診所資訊，並且將剛剛已經建立好的 LINE Login、Messaging API 相關內容貼上</p>
          <p className="mt-1">
            <a href="#" className="text-primary underline">圖一</a>、
            <a href="#" className="text-primary underline">圖二</a>、
            <a href="#" className="text-primary underline">圖三</a>
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-primary mb-2">STEP 3</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
          <p>
            填寫完畢後按下{" "}
            <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
              新增
            </span>
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-primary mb-2">STEP 4</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
          <p>
            請將畫面顯示的 Web Hook、Line Login Call Back 複製到{" "}
            <a
              href="https://developers.line.biz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Line Developer
            </a>{" "}
            中儲存
          </p>
          <p className="mt-1">
            <a href="#" className="text-primary underline">圖二</a>、
            <a href="#" className="text-primary underline">圖四</a>
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
  );
}

export default function ClinicEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const initial = id && mockClinics[id] ? mockClinics[id] : defaultForm;
  const [form, setForm] = useState(initial);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    toast.success(isNew ? "已新增診所" : "已儲存變更");
    navigate("/clinics");
  };

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        診所管理 &gt; 診所列表 &gt; {isNew ? "新增診所" : "編輯診所"}
      </div>
      <h1 className="text-2xl font-semibold mb-5">
        {isNew ? "新增診所" : "編輯診所"}
      </h1>

      <div className="flex gap-6 items-start">
        {/* Left: Step Guide (only for new) */}
        {isNew && (
          <div className="w-[420px] shrink-0">
            <StepGuide />
          </div>
        )}

        {/* Right: Form */}
        <div className="flex-1 bg-card rounded-lg shadow-sm p-6">
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
              value={form.isTaichungAssociation}
              onValueChange={(v) => update("isTaichungAssociation", v)}
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
            <Select value={form.businessGroup} onValueChange={(v) => update("businessGroup", v)}>
              <SelectTrigger className="bg-muted/50 text-sm">
                <SelectValue placeholder="請選擇" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taipei">臺北業務組</SelectItem>
                <SelectItem value="central">中區業務組</SelectItem>
                <SelectItem value="south">南區業務組</SelectItem>
                <SelectItem value="east">東區業務組</SelectItem>
                <SelectItem value="kaohsiung">高屏業務組</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>

          <FieldRow label="醫事機構代碼" required>
            <Input
              value={form.medicalCode}
              onChange={(e) => update("medicalCode", e.target.value)}
              className="bg-muted/50 text-sm"
            />
          </FieldRow>

          <FieldRow label="網路預約網址" required>
            <Input
              value={form.appointmentUrl}
              onChange={(e) => update("appointmentUrl", e.target.value)}
              className="bg-muted/50 text-sm"
            />
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

          {/* Read-only fields shown only in edit mode */}
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
                  <Input value={form.lineLoginCallback} readOnly className="bg-muted/50 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.lineLoginCallback)} className="text-sm shrink-0">
                    複製網址
                  </Button>
                </div>
              </FieldRow>

              <FieldRow label="問卷網址">
                <div className="flex items-center gap-2">
                  <Input value={form.surveyUrl} readOnly className="bg-muted/50 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.surveyUrl)} className="text-sm shrink-0">
                    複製網址
                  </Button>
                </div>
              </FieldRow>
            </>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={handleSave} className="px-8">
              {isNew ? "新增" : "儲存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
