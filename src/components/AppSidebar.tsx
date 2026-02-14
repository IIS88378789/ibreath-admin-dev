import { Building2, Users, Wind, Share2, HeartPulse, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import logoWhite from "@/assets/logo-white.png";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "診所管理", url: "/clinics", icon: Building2 },
  { title: "使用者管理", url: "/users", icon: Users },
  { title: "吸入器管理", url: "/inhalers", icon: Wind },
  { title: "轉介診所管理", url: "/referrals", icon: Share2 },
];

const diseaseSubItems = [
  { title: "疾病列表", url: "/diseases" },
  { title: "疾病相關表單", url: "/disease-forms" },
];

export function AppSidebar() {
  const location = useLocation();
  const isDiseaseActive = location.pathname.startsWith("/diseases") || location.pathname.startsWith("/disease-forms");
  const [diseaseOpen, setDiseaseOpen] = useState(isDiseaseActive);

  return (
    <Sidebar className="w-56 border-none">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2">
          <img src={logoWhite} alt="i-Breath" className="h-7 w-7" />
          <span className="text-[17px] font-bold text-sidebar-foreground tracking-wide">
            i-Breath
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-3.5 px-4 my-0.5">
                    <NavLink
                      to={item.url}
                      end={false}
                      className="flex items-center gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent rounded-md transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-base">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 疾病管理 with sub-menu */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="py-3.5 px-4 my-0.5 cursor-pointer"
                  onClick={() => setDiseaseOpen((prev) => !prev)}
                >
                  <div className={`flex items-center gap-3 w-full ${isDiseaseActive ? "text-sidebar-foreground font-semibold" : "text-sidebar-foreground/80"}`}>
                    <HeartPulse className="h-5 w-5 shrink-0" />
                    <span className="text-base flex-1">疾病管理</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${diseaseOpen ? "rotate-180" : ""}`} />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {diseaseOpen && diseaseSubItems.map((sub) => (
                <SidebarMenuItem key={sub.title}>
                  <SidebarMenuButton asChild className="py-2.5 pl-12 pr-4 my-0">
                    <NavLink
                      to={sub.url}
                      end
                      className="flex items-center gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent rounded-md transition-colors text-[14px]"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>{sub.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
