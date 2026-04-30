import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useExperience } from "@/integrations/supabase/hooks";

export const Experience = () => {
  const { data: experiences, isLoading } = useExperience();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  return (
    <section id="experience" className="py-24 bg-portfolio-bg">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Experience
          </h2>
        </motion.div>

        <div className="relative border-l border-portfolio-border-accent/50 ml-4 md:ml-6 space-y-12 pb-8">
          {experiences?.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 md:pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[5px] md:-left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-portfolio-accent shadow-[0_0_10px_rgba(0,217,126,0.5)]" />

              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-3 gap-2">
                <h3 className="text-2xl font-display font-bold text-white">
                  {exp.position}
                </h3>
                <span className="text-portfolio-accent font-medium text-sm shrink-0 bg-portfolio-accent-dim px-3 py-1 rounded-full border border-portfolio-border-accent">
                  {exp.duration}
                </span>
              </div>
              
              <p className="text-portfolio-text-sec font-medium mb-4 text-lg">
                {exp.company}
              </p>
              
              <p className="text-portfolio-text-sec/80 leading-relaxed max-w-3xl mb-6">
                {exp.description}
              </p>

              {/* Decorative skill/progress bar */}
              <div className="max-w-xs h-1 bg-portfolio-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-portfolio-accent" 
                  style={{ width: `${Math.random() * 30 + 70}%` }} 
                />
              </div>
            </motion.div>
          ))}

          {experiences?.length === 0 && (
            <div className="pl-8 text-portfolio-muted text-lg">
              No experience added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
