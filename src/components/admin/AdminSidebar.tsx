import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Rocket,
  User,
  Lightbulb,
  FolderKanban,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Globe,
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Hero", url: "/admin/hero", icon: Rocket },
  { title: "About", url: "/admin/about", icon: User },
  { title: "Skills", url: "/admin/skills", icon: Lightbulb },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Blog", url: "/admin/blog", icon: BookOpen },
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className={`font-display font-black tracking-widest uppercase flex items-center justify-center ${state === "collapsed" ? "text-sm" : "text-xl"}`}>
            <span className="text-white">{state === "collapsed" ? "Q" : "Quantum"}</span>
            <span className="text-accent">.</span>
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-portfolio-muted font-bold text-xs uppercase tracking-wider mt-4 mb-2">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-white/5 hover:text-white text-portfolio-text-sec rounded-xl transition-all duration-300"
                      activeClassName="bg-accent/10 text-accent font-medium border-l-2 border-accent rounded-l-none"
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
      <div className="p-4 border-t border-white/10 mt-auto flex flex-col gap-3">
        <SidebarMenuButton 
          onClick={() => navigate("/")}
          className="w-full text-portfolio-muted hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium flex items-center gap-3 py-6"
        >
          <Globe className="w-5 h-5" />
          {state !== "collapsed" && <span>View Portfolio</span>}
        </SidebarMenuButton>

        <SidebarMenuButton 
          onClick={handleLogout}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium flex items-center gap-3 py-6"
        >
          <LogOut className="w-5 h-5" />
          {state !== "collapsed" && <span>Logout</span>}
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
};
