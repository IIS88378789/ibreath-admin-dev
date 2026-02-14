import { Building2, Users, Wind, Share2, HeartPulse } from "lucide-react";
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
  { title: "疾病管理", url: "/diseases", icon: HeartPulse },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-44 border-none">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Wind className="h-7 w-7 text-sidebar-foreground" />
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
                  <SidebarMenuButton asChild className="py-3 px-4">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
