import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Loader2, GraduationCap } from "lucide-react";
import { useEducation } from "@/integrations/supabase/hooks";

const ElectricFilter = () => (
  <svg className="hidden w-0 h-0" style={{ position: "absolute" }}>
    <defs>
      <filter
        id="turbulent-displace"
        colorInterpolationFilters="sRGB"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
      >
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise1"
          seed="1"
        />
        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
          <animate
            attributeName="dy"
            values="700; 0"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise2"
          seed="1"
        />
        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
          <animate
            attributeName="dy"
            values="0; -700"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise1"
          seed="2"
        />
        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
          <animate
            attributeName="dx"
            values="490; 0"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise2"
          seed="2"
        />
        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
          <animate
            attributeName="dx"
            values="0; -490"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>
        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="combinedNoise"
          scale="30"
          xChannelSelector="R"
          yChannelSelector="B"
        />
      </filter>
    </defs>
  </svg>
);

const EduCard = ({ edu, index }: { edu: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative w-full h-full group"
      style={{ perspective: "1000px" }}
    >
      {/* ── Card container ── */}
      <div className="card-container relative h-full">

        {/* Electric turbulence border — always present, intensifies on hover */}
        <div
          className="absolute inset-0 rounded-[2rem] opacity-40 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.9) 0%, rgba(255,107,53,0.1) 50%, rgba(255,107,53,0.9) 100%)",
            filter: "url(#turbulent-displace) blur(1px)",
          }}
        />

        {/* Outer glow overlay — matches original overlay-1 */}
        <div
          className="absolute inset-0 rounded-[2rem] opacity-20 group-hover:opacity-60 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.6) 0%, transparent 40%, rgba(255,107,53,0.6) 100%)",
            filter: "blur(8px)",
          }}
        />

        {/* Background glow pulse — matches original background-glow */}
        <div
          className="absolute inset-[-8px] rounded-[2.5rem] opacity-10 group-hover:opacity-30 transition-opacity duration-1000"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,107,53,0.5) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Inner border ring — matches original border-outer / main-card */}
        <div className="absolute inset-[1px] rounded-[2rem] border border-white/10 group-hover:border-[rgba(255,107,53,0.4)] transition-colors duration-500" />

        {/* Glass base */}
        <div
          className="relative h-full flex flex-col rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-[rgba(255,107,53,0.2)] transition-colors duration-500"
          style={{ background: "rgba(13,13,13,0.92)", backdropFilter: "blur(24px)" }}
        >
          {/* Shimmer sweep on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-full group-hover:translate-y-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,107,53,0) 0%, rgba(255,107,53,0.06) 50%, rgba(255,107,53,0) 100%)",
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col flex-1 min-h-[350px] sm:min-h-[420px] md:min-h-[450px]">

            {/* Top row: icon + date badge */}
            <div className="flex items-start justify-between mb-8 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[rgba(255,107,53,0.4)] transition-all duration-500"
                style={{ background: "#111" }}
              >
                <GraduationCap
                  className="w-7 h-7 text-white/50 group-hover:text-[#ff6b35] transition-colors duration-500"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,107,53,0))" }}
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
            <div className="mb-6 group-hover:-translate-y-1 transition-transform duration-500 delay-75 ease-out">
              <h3 className="text-2xl md:text-3xl font-display font-semibold text-white mb-3 leading-[1.2] tracking-[-0.02em]">
                {edu.degree}
              </h3>
              <p className="text-[#ff6b35] font-body font-medium tracking-normal leading-[1.6]">{edu.institution}</p>
            </div>

            {/* Field + description + grade */}
            <div className="flex-1 flex flex-col justify-between group-hover:-translate-y-1 transition-transform duration-500 delay-150 ease-out">
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
        </div>
      </div>
    </motion.div>
  );
};

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

  return (
    <section
      ref={containerRef}
      id="education"
      className="py-32 md:py-48 bg-[#0d0d0d] relative overflow-hidden"
    >
      <ElectricFilter />

      {/* Ambient parallax orbs */}
      <motion.div
        style={{ y: parallax1 }}
        className="absolute top-1/4 -left-32 md:left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
        css={{ background: "rgba(255,107,53,0.05)", filter: "blur(120px)" }}
      />
      <motion.div
        style={{ y: parallax2 }}
        className="absolute bottom-1/4 -right-32 md:right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
        css={{ background: "rgba(255,255,255,0.02)", filter: "blur(150px)" }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-[1400px]">
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

        {/* Cards grid */}
        <div className="relative w-full mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {education?.map((edu, index) => (
              <EduCard key={edu.id} edu={edu} index={index} />
            ))}
          </div>

          {education?.length === 0 && (
            <div className="text-center text-white/40 text-lg py-24 font-display uppercase tracking-widest">
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