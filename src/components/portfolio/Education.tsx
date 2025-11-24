import { motion } from "framer-motion";
import { GraduationCap, Calendar, Loader2 } from "lucide-react";
import { useEducation } from "@/integrations/supabase/hooks";

export const Education = () => {
  const { data: education, isLoading } = useEducation();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary hidden md:block" />

          <div className="space-y-12">
            {education?.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-cyan z-10 hidden md:block" />

                <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <div className="glass-strong p-6 rounded-2xl border border-primary/20 glow-hover-cyan">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                        <p className="text-sm text-primary">{edu.institution}</p>
                        <p className="text-xs text-foreground/70">{edu.field_of_study}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/50 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {edu.start_date} - {edu.end_date || "Present"}
                      </span>
                    </div>
                    {edu.grade && (
                      <p className="text-xs font-semibold text-secondary mb-2">Grade: {edu.grade}</p>
                    )}
                    <p className="text-foreground/70 text-sm">{edu.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {education?.length === 0 && (
              <div className="text-center text-foreground/50">
                No education added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
