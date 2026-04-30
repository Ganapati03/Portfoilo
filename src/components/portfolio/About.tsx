import { motion } from "framer-motion";
import { useProfile, useExperience, useProjects } from "@/integrations/supabase/hooks";

export const About = () => {
  const { data: profile } = useProfile();
  const { data: experience } = useExperience();
  const { data: projects } = useProjects();

  const calculateYearsExperience = () => {
    if (!experience || experience.length === 0) return 0;
    
    const validDates = experience
      .filter(exp => exp.start_date)
      .map(exp => new Date(exp.start_date!).getTime());
      
    if (validDates.length === 0) return 0;

    const earliestDate = Math.min(...validDates);
    const diff = Date.now() - earliestDate;
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    
    return Math.floor(years);
  };

  const yearsExperience = calculateYearsExperience();
  const projectCount = projects?.length || 0;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-24 relative bg-portfolio-bg overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-portfolio-accent/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight mb-8">
              Designing<br/>
              <span className="text-portfolio-text-sec">Success</span><br/>
              One Project<br/>
              <span className="text-portfolio-accent">At Time.</span>
            </h2>

            <div className="flex gap-8 mt-4">
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">{yearsExperience}+</div>
                <div className="text-sm font-medium tracking-wide text-portfolio-muted uppercase">Years Experience</div>
              </div>
              <div className="w-px h-16 bg-portfolio-border" />
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">{projectCount}+</div>
                <div className="text-sm font-medium tracking-wide text-portfolio-muted uppercase">Projects Completed</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-portfolio-text-sec leading-relaxed text-lg lg:text-xl">
              {profile?.bio || "I'm a full-stack developer with a passion for creating beautiful, functional, and user-friendly applications. With expertise in modern web technologies, I transform ideas into elegant solutions."}
            </p>

            <div className="space-y-4 pt-4">
              <h3 className="text-white font-display font-bold text-xl">My Core Focus</h3>
              <ul className="space-y-3">
                {["Frontend Architecture", "UI/UX Design Implementation", "Performance Optimization"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-portfolio-text-sec">
                    <div className="w-1.5 h-1.5 rounded-full bg-portfolio-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection("contact")}
                className="bg-portfolio-accent text-portfolio-bg px-8 py-3.5 rounded-full font-bold text-base inline-flex hover:brightness-110 transition-all"
              >
                Contact me
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
