import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { useProfile, useExperience, useProjects, useSkills } from "@/integrations/supabase/hooks";
import { Calendar, Code, Rocket, ArrowRight } from "lucide-react";

const AnimatedCounter = ({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          node.textContent = Math.round(value).toString() + "+";
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration]);

  return <div ref={nodeRef} className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white mb-2 tracking-[-0.04em]" />;
};

export const About = () => {
  const { data: profile } = useProfile();
  const { data: experience } = useExperience();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const calculateYearsExperience = () => {
    if (!experience || experience.length === 0) return 0;
    const validDates = experience.filter(exp => exp.start_date).map(exp => new Date(exp.start_date!).getTime());
    if (validDates.length === 0) return 0;
    const earliestDate = Math.min(...validDates);
    const diff = Date.now() - earliestDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const yearsExperience = calculateYearsExperience();
  const projectCount = projects?.length || 0;
  const skillCount = skills?.length || 0;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const bioLines = profile?.bio ? profile.bio.split('.') : ["I craft digital experiences.", "I build modern scalable web applications."];

  return (
    <section ref={containerRef} id="about" className="min-h-screen relative bg-background overflow-hidden py-32">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-center min-h-[80vh]">
          
          {/* Left Column: Image with Parallax and Glow */}
          <motion.div 
            style={{ y: imgY }}
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-full aspect-[4/5] lg:aspect-[3/4] mx-auto lg:mx-0 group perspective-1000"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Glow Behind */}
              <div className="absolute inset-[-20px] bg-accent/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 z-10"
              >
                <img
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"}
                  alt="Profile Portrait"
                  className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Diagonal Flash Effect */}
                <div className="flash-effect" />
              </motion.div>

              {/* Decorative Frame */}
              <div className="absolute inset-0 rounded-[2rem] border border-accent translate-x-3 translate-y-3 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700" />
            </motion.div>
          </motion.div>

          {/* Right Column: Storytelling Text */}
          <motion.div style={{ y: textY }} className="flex flex-col justify-center lg:pl-12">
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {}
              }}
              className="space-y-8"
            >
              <div className="flex flex-col items-start gap-1">
                <motion.span 
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="text-accent text-xs tracking-[0.1em] uppercase font-display font-medium"
                >
                  The Story
                </motion.span>
                <motion.div 
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="w-8 h-px bg-accent/70"
                />
              </div>
              
              <div className="space-y-6">
                <motion.h2 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-[40px] font-display font-bold text-white leading-tight tracking-tight"
                >
                  {profile?.title || "MERN Stack Developer"}
                </motion.h2>

                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-base md:text-lg font-body font-normal text-white/70 leading-normal"
                >
                  <p>{profile?.bio || "MERN Stack Developer who loves transforming ideas into fast, functional, and user-friendly web applications. I specialize in building responsive interfaces, clean architectures, and scalable backend systems that solve real-world problems. With strong skills in JavaScript, React, Node.js, Express, and MongoDB, I enjoy crafting seamless digital experiences from front to back."}</p>
                </motion.div>
              </div>

              {/* Statistics Counters */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 border-t border-white/10"
              >
                {/* Stat 1 */}
                <div className="flex flex-col border-r border-white/10 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <AnimatedCounter from={0} to={yearsExperience || 2} />
                  <div className="text-[10px] md:text-xs font-display font-medium tracking-[0.1em] text-portfolio-muted uppercase">Years<br/>Experience</div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col border-r border-white/10 px-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center mb-4">
                    <Code className="w-5 h-5 text-accent" />
                  </div>
                  <AnimatedCounter from={0} to={projectCount || 4} />
                  <div className="text-[10px] md:text-xs font-display font-medium tracking-[0.1em] text-portfolio-muted uppercase">Projects<br/>Delivered</div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col pl-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center mb-4">
                    <Rocket className="w-5 h-5 text-accent" />
                  </div>
                  <AnimatedCounter from={0} to={skillCount || 10} />
                  <div className="text-[10px] md:text-xs font-display font-medium tracking-[0.1em] text-portfolio-muted uppercase">Technologies<br/>Mastered</div>
                </div>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="pt-4"
              >
                <button
                  onClick={() => scrollToSection("experience")}
                  className="group flex items-center gap-4 bg-transparent border border-accent text-white px-8 py-3.5 rounded-full font-display font-semibold tracking-[0.12em] text-xs uppercase hover:bg-accent/5 transition-all duration-300 w-fit"
                >
                  View Timeline
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
