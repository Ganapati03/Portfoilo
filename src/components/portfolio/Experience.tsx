import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Briefcase, Code, Trophy, Layout } from "lucide-react";
import { useExperience } from "@/integrations/supabase/hooks";

// Helper to determine icon based on position title
const getIconForRole = (position: string) => {
  const p = position.toLowerCase();
  if (p.includes("hackthon") || p.includes("hackathon") || p.includes("competition")) return Trophy;
  if (p.includes("dev") || p.includes("engineer") || p.includes("programmer")) return Code;
  if (p.includes("design") || p.includes("ui") || p.includes("ux")) return Layout;
  return Code;
};

// Helper to extract keywords to act as fake "skills" badges
const extractSkills = (desc: string) => {
  const allSkills = ["HTML", "CSS", "JavaScript", "React.js", "Node.js", "Python", "SQL", "Tailwind"];
  return allSkills.filter(s => desc.toLowerCase().includes(s.toLowerCase())).slice(0, 4);
};

const ExperienceRow = ({ exp, index }: { exp: any; index: number }) => {
  const IconComponent = getIconForRole(exp.position);
  const defaultSkills = ["HTML", "CSS", "JavaScript", "React.js"];
  const badges = extractSkills(exp.description || "");
  const skillsToShow = badges.length > 0 ? badges : defaultSkills;
  
  let badgeText = "Experience";
  if (exp.position.toLowerCase().includes("intern")) badgeText = "Internship";
  else if (exp.position.toLowerCase().includes("hackathon") || exp.position.toLowerCase().includes("hackthon")) badgeText = "Competition";

  return (
    <div className="relative flex flex-col md:flex-row items-stretch w-full mb-12 md:mb-16 group">

      {/* Continuous vertical line passing through ALL rows (behind node) */}
      <div className="hidden md:block absolute left-[180px] top-0 bottom-0 w-[2px] bg-white/10" />
      
      {/* Left Column: Date & Location (Desktop) */}
      <div className="hidden md:block w-[180px] shrink-0 text-right pr-12 pt-6">
        <h4 className="text-accent font-medium text-sm mb-1">{exp.duration}</h4>
        <p className="text-portfolio-muted text-xs">Remote</p>
      </div>

      {/* Timeline Node centered on the line (Desktop) */}
      <div className="hidden md:flex items-start justify-center w-0 shrink-0 relative z-10">
        <div className="absolute top-6 -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-[#0a0a0a] border-2 border-accent flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.5)] group-hover:shadow-[0_0_25px_rgba(255,107,53,0.9)] transition-shadow duration-300">
          <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Mobile Date (Shown only on small screens) */}
      <div className="md:hidden flex items-center gap-4 mb-4 pl-2">
        <div className="w-4 h-4 rounded-full border-2 border-accent flex items-center justify-center">
           <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
        <div>
          <h4 className="text-accent font-medium text-sm">{exp.duration}</h4>
          <p className="text-portfolio-muted text-xs">Remote</p>
        </div>
      </div>

      {/* Right Column: The Card */}
      <div className="flex-1 md:pl-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-[#111111]/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/5 group-hover:border-white/10 transition-colors duration-300 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight mb-1">{exp.position}</h3>
                <p className="text-portfolio-muted font-medium text-sm">{exp.company}</p>
              </div>
            </div>
            
            <span className="px-4 py-1.5 rounded-full border border-accent/20 bg-[#1a1a1a] text-accent text-xs font-medium tracking-wide whitespace-nowrap">
              {badgeText}
            </span>
          </div>

          {/* Description */}
          <p className="text-portfolio-text-sec text-[15px] leading-relaxed mb-6 max-w-3xl">
            {exp.description}
          </p>

          {/* Skills Row */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
            {skillsToShow.map((skill, idx) => {
              let color = "bg-white text-black";
              if (skill === "HTML") color = "bg-[#E34F26] text-white";
              if (skill === "CSS") color = "bg-[#1572B6] text-white";
              if (skill === "JavaScript") color = "bg-[#F7DF1E] text-black";
              if (skill === "React.js") color = "bg-[#61DAFB] text-black";
              if (skill === "Node.js") color = "bg-[#339933] text-white";

              return (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-white/5 text-white/80 text-xs font-medium">
                  <div className={`w-3.5 h-3.5 rounded-sm ${color} flex items-center justify-center overflow-hidden`}>
                     <span className="text-[9px] font-black tracking-tighter leading-none mt-px">
                       {skill.charAt(0)}
                     </span>
                  </div>
                  {skill}
                </div>
              );
            })}
            
            {/* +2 indicator */}
            <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-white/5 text-white/60 text-xs font-medium">
              +2
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Experience = () => {
  const { data: experiences, isLoading } = useExperience();

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section id="experience" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center md:text-left md:pl-[180px]"
        >
          <h2 className="font-display font-black text-4xl md:text-5xl text-white">
            Experience
          </h2>
        </motion.div>

        <div className="relative">
          {experiences?.map((exp, index) => (
            <ExperienceRow key={exp.id} exp={exp} index={index} />
          ))}

          {experiences?.length === 0 && (
            <div className="text-portfolio-muted text-lg py-12 md:pl-[180px]">
              No experience added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
