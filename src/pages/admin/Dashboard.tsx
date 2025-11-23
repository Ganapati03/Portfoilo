import { motion } from "framer-motion";
import { FolderKanban, Award, Lightbulb, MessageSquare, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useProjects, useCertifications, useSkills, useMessages } from "@/integrations/supabase/hooks";

const Dashboard = () => {
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: certifications, isLoading: loadingCerts } = useCertifications();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: messages, isLoading: loadingMessages } = useMessages();

  const stats = [
    { title: "Total Projects", value: projects?.length || 0, icon: FolderKanban, color: "text-primary", loading: loadingProjects },
    { title: "Certifications", value: certifications?.length || 0, icon: Award, color: "text-secondary", loading: loadingCerts },
    { title: "Skills", value: skills?.length || 0, icon: Lightbulb, color: "text-primary", loading: loadingSkills },
    { title: "Messages", value: messages?.length || 0, icon: MessageSquare, color: "text-secondary", loading: loadingMessages },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here's your portfolio overview.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">
                    {stat.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New project added</p>
                  <p className="text-xs text-foreground/50">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Add Project", "Add Skill", "New Certificate", "View Messages"].map((action) => (
              <button
                key={action}
                className="p-4 glass rounded-xl border border-primary/20 hover:glow-cyan transition-all text-sm font-medium"
              >
                {action}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
