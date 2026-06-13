import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Menu } from "lucide-react";
import { motion } from "framer-motion";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <AdminSidebar />
        
        <main className="flex-1 overflow-auto relative z-10 flex flex-col w-full">
          {/* Mobile Header with Hamburger Menu */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
            <h2 className="font-display font-black tracking-widest uppercase text-xl">
              <span className="text-white">Quantum</span>
              <span className="text-accent">.</span>
            </h2>
            <SidebarTrigger className="text-white hover:text-accent p-2">
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
          </div>

          <div className="flex-1 p-4 md:p-10 w-full max-w-[100vw] overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
