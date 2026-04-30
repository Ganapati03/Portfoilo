import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  return (
    <section id="skills" className="py-24 bg-portfolio-bg">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-32"
            >
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Skills &<br/>Expertise
              </h2>
              <p className="text-portfolio-text-sec text-lg">
                Technologies and tools I use to build robust, scalable digital solutions.
              </p>
            </motion.div>
          </div>

          <div className="md:w-2/3 flex flex-col gap-12">
            {Object.entries(skillsByCategory).map(([category, items], categoryIndex) => (
              <motion.div 
                key={category}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.03 } },
                  hidden: {}
                }}
                className="flex flex-col"
              >
                <motion.h3 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-portfolio-muted font-display text-sm tracking-widest uppercase mb-6 border-b border-portfolio-border pb-2"
                >
                  {category}
                </motion.h3>
                
                <div className="flex flex-wrap gap-3">
                  {items.map((item) => (
                    <motion.div
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="px-5 py-2.5 rounded-full bg-portfolio-accent-dim text-portfolio-accent font-medium text-sm border border-portfolio-border-accent/50 hover:bg-portfolio-accent hover:text-portfolio-bg transition-colors cursor-default"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {Object.keys(skillsByCategory).length === 0 && (
              <div className="text-portfolio-muted text-lg">
                No skills added yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
