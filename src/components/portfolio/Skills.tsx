import { motion } from "framer-motion";
import { Code2, Database, Palette, Zap, Loader2 } from "lucide-react";
import { useSkills } from "@/integrations/supabase/hooks";
import { Database as DatabaseType } from "@/integrations/supabase/types";

type Skill = DatabaseType['public']['Tables']['skills']['Row'];

export const Skills = () => {
  const { data, isLoading } = useSkills();
  const skillsData = data as Skill[] | null;

  // Group skills by category
  const skillsByCategory = skillsData?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>) || {};

  // Define icons for known categories (fallback to Zap)
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend": return Code2;
      case "backend": return Database;
      case "design": return Palette;
      default: return Zap;
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(skillsByCategory).map(([category, items], index) => {
            const Icon = getIcon(category);
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-strong p-6 rounded-2xl border border-primary/20 glow-hover-cyan group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{category}</h3>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          {Object.keys(skillsByCategory).length === 0 && (
            <div className="col-span-full text-center text-foreground/50">
              No skills added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
