import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Rocket,
  User,
  Lightbulb,
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Hero", url: "/admin/hero", icon: Rocket },
  { title: "About", url: "/admin/about", icon: User },
  { title: "Skills", url: "/admin/skills", icon: Lightbulb },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Certifications", url: "/admin/certifications", icon: Award },
  { title: "Experience", url: "/admin/experience", icon: Briefcase },
  { title: "Education", url: "/admin/education", icon: GraduationCap },
  { title: "AI Knowledge", url: "/admin/ai-knowledge", icon: Brain },
  { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-primary/20">
          <h2 className={`font-bold gradient-text ${state === "collapsed" ? "text-center text-sm" : "text-xl"}`}>
            {state === "collapsed" ? "AP" : "Admin Panel"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-primary/10 rounded-xl transition-all"
                      activeClassName="bg-primary/20 text-primary font-medium glow-cyan"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
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
};
