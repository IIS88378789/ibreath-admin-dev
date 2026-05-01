import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ibreathLogo from "@/assets/ibreath-logo.png";
import { saveToken, saveUsername } from "@/lib/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userid.trim() || !password.trim()) {
      toast.error("請輸入帳號和密碼");
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
      const response = await fetch(`${apiBase}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: userid.trim(), password: password.trim() }),
      });

      if (!response.ok) {
        throw new Error(`登入失敗: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.statuscode !== 200) {
        throw new Error(data.message || "登入失敗");
      }

      saveToken(data.accessToken);
      saveUsername(data.username);

      toast.success(`歡迎回來，${data.username}！`);
      navigate("/clinics");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "登入失敗，請稍後再試";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("忘記密碼功能開發中");
  };

  return (
    <div className="min-h-screen bg-[#e8e8e8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img
            src={ibreathLogo}
            alt="i-Breath"
            className="h-16 object-contain"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              帳號/信箱
            </label>
            <Input
              type="text"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              className="h-12 bg-white border-gray-300 rounded-lg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              密碼
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-white border-gray-300 rounded-lg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-[#51b9ea] hover:bg-[#3daade] text-white font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "登入中..." : "登入"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleForgotPassword}
              className="w-full h-12 bg-[#a8d9f5] hover:bg-[#8ecef1] text-white border-0 font-medium rounded-lg"
              disabled={isLoading}
            >
              忘記密碼
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
