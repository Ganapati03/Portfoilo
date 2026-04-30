import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEducation } from "@/integrations/supabase/hooks";

export const Education = () => {
  const { data: education, isLoading } = useEducation();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  return (
    <section id="education" className="py-24 bg-portfolio-bg">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Education
          </h2>
        </motion.div>

        <div className="relative border-l border-portfolio-border-accent/50 ml-4 md:ml-6 space-y-12 pb-8">
          {education?.map((edu, index) => (
            <motion.div
              key={edu.id}
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
                  {edu.degree}
                </h3>
                <span className="text-portfolio-accent font-medium text-sm shrink-0 bg-portfolio-accent-dim px-3 py-1 rounded-full border border-portfolio-border-accent">
                  {edu.start_date} - {edu.end_date || "Present"}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <p className="text-portfolio-text-sec font-medium text-lg">
                  {edu.institution}
                </p>
                <span className="text-portfolio-muted hidden md:block">•</span>
                <p className="text-portfolio-muted text-lg">
                  {edu.field_of_study}
                </p>
              </div>
              
              <p className="text-portfolio-text-sec/80 leading-relaxed max-w-3xl">
                {edu.description}
              </p>

              {edu.grade && (
                <div className="mt-4 inline-block px-3 py-1 rounded border border-portfolio-border bg-portfolio-card">
                  <span className="text-sm font-medium text-portfolio-muted">Grade: </span>
                  <span className="text-sm font-bold text-white">{edu.grade}</span>
                </div>
              )}
            </motion.div>
          ))}

          {education?.length === 0 && (
            <div className="pl-8 text-portfolio-muted text-lg">
              No education history added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
