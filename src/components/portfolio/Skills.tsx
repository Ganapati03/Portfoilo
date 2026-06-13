import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSkills } from "@/integrations/supabase/hooks";
import { Database } from "@/integrations/supabase/types";

type Skill = Database['public']['Tables']['skills']['Row'];

export const Skills = () => {
  const { data, isLoading } = useSkills();
  const skillsData = data as Skill[] | null;
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Group skills by category
  const skillsByCategory = skillsData?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  // For the infinite marquee
  const allSkillNames = skillsData?.map(s => s.name) || ["React", "TypeScript", "Node.js", "Three.js", "Framer Motion", "Tailwind CSS", "Next.js"];
  const duplicatedMarquee = [...allSkillNames, ...allSkillNames, ...allSkillNames];

  if (isLoading) {
    return (
      <div ref={containerRef as any} className="py-24 flex justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section ref={containerRef} id="skills" className="py-32 relative bg-background overflow-hidden">
      
      {/* Infinite Marquee Background */}
      <div className="absolute top-1/4 left-0 w-full overflow-hidden opacity-5 pointer-events-none select-none -rotate-2">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {duplicatedMarquee.map((name, i) => (
            <span key={i} className="text-8xl font-display font-black mx-8 text-white uppercase">
              {name}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute top-2/4 left-0 w-full overflow-hidden opacity-5 pointer-events-none select-none rotate-2">
        <motion.div 
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {duplicatedMarquee.reverse().map((name, i) => (
            <span key={i} className="text-8xl font-display font-black mx-8 text-white uppercase text-outline">
              {name}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-accent mb-4 block">
            Capabilities
          </span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white">
            Technology Stack
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(skillsByCategory).map(([category, skills], index) => (
            <motion.div 
              key={category}
              style={{ y: index % 2 === 0 ? y1 : y2 }}
              className="glass-card p-8 group hover:-translate-y-4 transition-transform duration-500"
            >
              <h3 className="text-xl font-display font-semibold tracking-[-0.02em] leading-[1.2] text-white mb-8 flex items-center gap-4">
                <div className="w-8 h-px bg-accent flex-shrink-0" />
                {category}
              </h3>
              
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.id} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body font-medium text-white">{skill.name}</span>
                      <span className="font-display font-bold tracking-[-0.04em] text-portfolio-muted text-sm">{skill.proficiency}%</span>
                    </div>
                    {/* Skill progress bar visualization */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-accent/50 to-accent relative"
                      >
                        <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-50 shadow-[0_0_10px_#fff]" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {Object.keys(skillsByCategory).length === 0 && (
            <div className="text-portfolio-muted text-lg col-span-full text-center">
              No skills added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
