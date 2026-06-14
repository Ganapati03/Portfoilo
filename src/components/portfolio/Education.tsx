import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Loader2, GraduationCap } from "lucide-react";
import { useEducation } from "@/integrations/supabase/hooks";

export const Education = () => {
  const { data: education, isLoading } = useEducation();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const parallax1 = useTransform(smoothProgress, [0, 1], [150, -150]);
  const parallax2 = useTransform(smoothProgress, [0, 1], [-150, 150]);

  if (isLoading) {
    return (
      <div
        ref={containerRef as any}
        className="py-32 flex justify-center bg-background min-h-[50vh]"
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
      </div>
    );
  }

  // Pre-defined rotations for the scattered deck look
  const rotations = [3, -1, -5, -2, 2, 4, -3, 1, -4];

  return (
    <section
      ref={containerRef}
      id="education"
      className="py-32 md:py-48 bg-[#0d0d0d] relative overflow-hidden"
    >
      {/* Ambient parallax orbs */}
      <motion.div
        style={{ y: parallax1, background: "rgba(255,107,53,0.05)", filter: "blur(120px)" }}
        className="absolute top-1/4 -left-32 md:left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: parallax2, background: "rgba(255,255,255,0.02)", filter: "blur(150px)" }}
        className="absolute bottom-1/4 -right-32 md:right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10 max-w-[1400px] flex flex-col items-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 md:mb-40"
        >
          <span className="text-[#ff6b35] text-xs font-display font-medium tracking-[0.1em] uppercase mb-6 block">
            Continuous Learning
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white">
            Education Journey
          </h2>
          <p className="mt-6 text-white/70 font-body font-normal md:font-medium leading-[1.7] text-lg md:text-xl max-w-2xl mx-auto">
            The academic foundation of my technical growth and problem-solving mindset.
          </p>
        </motion.div>

        {/* Cards container using the requested overlapping deck design */}
        <div className="exp-card__container w-full mt-16">
          {education?.map((edu, index) => {
            const rotation = rotations[index % rotations.length];

            return (
              <div 
                key={edu.id} 
                className="exp-card p-6 sm:p-8 md:p-10 flex flex-col group"
                tabIndex={0}
                style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
              >
                {/* Top row: icon + date badge */}
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#ff6b35] transition-all duration-500"
                    style={{ background: "#111" }}
                  >
                    <GraduationCap
                      className="w-7 h-7 text-white/50 group-hover:text-[#ff6b35] transition-colors duration-500"
                    />
                  </div>

                  <div
                    className="px-4 py-1.5 rounded-full border border-white/10 text-white/60 text-xs font-display font-medium tracking-[0.1em] uppercase group-hover:text-white group-hover:bg-[rgba(255,107,53,0.15)] group-hover:border-[rgba(255,107,53,0.35)] transition-all duration-500"
                    style={{ backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.04)" }}
                  >
                    {edu.start_date} — {edu.end_date || "Present"}
                  </div>
                </div>

                {/* Degree + institution */}
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-white mb-3 leading-[1.2] tracking-[-0.02em]">
                    {edu.degree}
                  </h3>
                  <p className="text-[#ff6b35] font-body font-medium tracking-normal leading-[1.6]">
                    {edu.institution}
                  </p>
                </div>

                {/* Field + description + grade */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-white/40 text-xs font-display font-medium tracking-[0.1em] uppercase">
                      {edu.field_of_study}
                    </p>
                    <p className="font-body font-normal text-white/70 leading-[1.7] text-sm md:text-base line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                      {edu.description}
                    </p>
                  </div>

                  {edu.grade && (
                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-white/30 text-xs font-display font-medium tracking-[0.1em] uppercase">Grade</span>
                      <span
                        className="text-white font-display font-black tracking-[-0.04em] text-xl group-hover:text-[#ff6b35] transition-colors duration-500"
                        style={{ textShadow: "0 0 10px rgba(255,255,255,0.15)" }}
                      >
                        {edu.grade}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {education?.length === 0 && (
            <div className="text-center text-white/40 text-lg py-24 font-display uppercase tracking-widest w-full">
              No education history available
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
    </section>
  );
};