import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Code2, 
  Terminal, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Clock
} from "lucide-react";
import { useExperience } from "@/integrations/supabase/hooks";

// Comprehensive skill detection map with custom color palettes
const KNOWN_SKILLS: Record<string, { bg: string; text: string; dot: string }> = {
  "React": { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-300", dot: "bg-cyan-400" },
  "React.js": { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-300", dot: "bg-cyan-400" },
  "TypeScript": { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-300", dot: "bg-blue-400" },
  "JavaScript": { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", dot: "bg-amber-400" },
  "Next.js": { bg: "bg-white/10 border-white/20", text: "text-white", dot: "bg-white" },
  "Node.js": { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  "Python": { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-300", dot: "bg-yellow-400" },
  "Tailwind": { bg: "bg-teal-500/10 border-teal-500/20", text: "text-teal-300", dot: "bg-teal-400" },
  "Tailwind CSS": { bg: "bg-teal-500/10 border-teal-500/20", text: "text-teal-300", dot: "bg-teal-400" },
  "Supabase": { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  "PostgreSQL": { bg: "bg-indigo-500/10 border-indigo-500/20", text: "text-indigo-300", dot: "bg-indigo-400" },
  "SQL": { bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", dot: "bg-sky-400" },
  "HTML": { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-300", dot: "bg-orange-400" },
  "CSS": { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-300", dot: "bg-blue-400" },
  "Git": { bg: "bg-red-500/10 border-red-500/20", text: "text-red-300", dot: "bg-red-400" },
  "REST API": { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-300", dot: "bg-purple-400" },
  "Docker": { bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", dot: "bg-sky-400" },
  "Framer Motion": { bg: "bg-pink-500/10 border-pink-500/20", text: "text-pink-300", dot: "bg-pink-400" },
  "UI/UX": { bg: "bg-fuchsia-500/10 border-fuchsia-500/20", text: "text-fuchsia-300", dot: "bg-fuchsia-400" },
  "AI": { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-300", dot: "bg-rose-400" },
};

// Helper to extract keywords from role description
const extractTechSkills = (text: string): string[] => {
  const detected: string[] = [];
  const lower = text.toLowerCase();
  
  Object.keys(KNOWN_SKILLS).forEach((skill) => {
    // Regex word boundary matching to avoid false positives (e.g. "it" in "Git")
    const regex = new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "i");
    if (regex.test(lower) && !detected.includes(skill)) {
      detected.push(skill);
    }
  });

  return detected.slice(0, 6);
};

// Calculate human-friendly duration & tenure
const formatPeriod = (startDate?: string, endDate?: string, current?: boolean) => {
  if (!startDate) {
    return { formatted: "Recent Experience", durationText: "" };
  }

  const start = new Date(startDate);
  const end = current || !endDate ? new Date() : new Date(endDate);

  const startStr = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const endStr = current ? "Present" : end.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Calculate difference in months
  const totalMonths = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let durationText = "";
  if (years > 0 && months > 0) durationText = `(${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""})`;
  else if (years > 0) durationText = `(${years} yr${years > 1 ? "s" : ""})`;
  else durationText = `(${months} mo${months > 1 ? "s" : ""})`;

  return { formatted: `${startStr} – ${endStr}`, durationText };
};

// Determine role categorization
const categorizeRole = (position: string) => {
  const p = position.toLowerCase();
  if (p.includes("hackathon") || p.includes("hackthon") || p.includes("competition") || p.includes("winner")) {
    return { type: "Competition", icon: Trophy, color: "text-amber-400", badgeBg: "bg-amber-400/10 border-amber-400/30 text-amber-300" };
  }
  if (p.includes("intern")) {
    return { type: "Internship", icon: Terminal, color: "text-sky-400", badgeBg: "bg-sky-400/10 border-sky-400/30 text-sky-300" };
  }
  if (p.includes("lead") || p.includes("senior") || p.includes("head")) {
    return { type: "Leadership", icon: Sparkles, color: "text-accent", badgeBg: "bg-accent/10 border-accent/30 text-accent" };
  }
  return { type: "Engineering", icon: Code2, color: "text-accent", badgeBg: "bg-accent/10 border-accent/30 text-accent" };
};

// Fallback seed experiences if DB is completely fresh
const fallbackExperiences = [
  {
    id: "exp-1",
    position: "Full-Stack Software Engineer",
    company: "Freelance & Independent Client Contracts",
    start_date: "2024-01-01",
    end_date: null,
    current: true,
    description: "Architected modern responsive web applications and full-stack client dashboards with React, TypeScript, and Supabase.\nImplemented real-time data synchronization, automated CI/CD deployment pipelines, and high-performance UI components with Framer Motion.\nIntegrated payment gateways, authentication flows, and PostgreSQL database queries with Row Level Security.",
  },
  {
    id: "exp-2",
    position: "Frontend Developer Intern",
    company: "Tech Systems & Digital Solutions",
    start_date: "2023-05-01",
    end_date: "2023-12-01",
    current: false,
    description: "Developed reusable UI design systems and interactive dashboard modules using React.js and Tailwind CSS.\nCollaborated directly with product teams to translate Figma wireframes into pixel-perfect responsive layouts.\nReduced bundle load time by 35% through lazy loading, image optimization, and efficient state management.",
  },
  {
    id: "exp-3",
    position: "National Hackathon Finalist & Developer",
    company: "Innovation Tech Challenge",
    start_date: "2023-09-01",
    end_date: "2023-09-30",
    current: false,
    description: "Built and pitched a real-time collaborative web application in a 36-hour sprint using Next.js and WebSockets.\nRecognized among top teams for rapid prototyping, robust system architecture, and clean user experience.",
  }
];

// Single Experience Item Card
const ExperienceCard = ({ exp, index, isLast }: { exp: any; index: number; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatted, durationText } = formatPeriod(exp.start_date, exp.end_date, exp.current);
  const roleMeta = categorizeRole(exp.position);
  const RoleIcon = roleMeta.icon;

  // Split description into distinct bullet highlights
  const rawDesc = exp.description || "";
  const lines = rawDesc
    .split(/\n|•/)
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0);

  const skills = useMemo(() => {
    const extracted = extractTechSkills(rawDesc + " " + exp.position);
    if (extracted.length > 0) return extracted;
    return ["React", "TypeScript", "Tailwind", "JavaScript"];
  }, [rawDesc, exp.position]);

  return (
    <div className="relative flex flex-col md:flex-row items-stretch w-full group">
      
      {/* Vertical Timeline Track Line */}
      {!isLast && (
        <div className="hidden md:block absolute left-[200px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-accent/40 via-white/10 to-white/5 -translate-x-1/2" />
      )}

      {/* Left Column: Date & Tenure (Desktop) */}
      <div className="hidden md:flex flex-col items-end w-[200px] shrink-0 text-right pr-10 pt-4">
        {exp.current && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Current Role
          </span>
        )}
        <h4 className="text-white font-display font-bold text-sm tracking-tight mb-1">
          {formatted}
        </h4>
        {durationText && (
          <p className="text-portfolio-muted text-xs font-mono font-medium">
            {durationText}
          </p>
        )}
        <div className="flex items-center gap-1 text-[11px] text-white/40 mt-2 font-mono">
          <MapPin className="w-3 h-3 text-accent" />
          <span>Remote / Flexible</span>
        </div>
      </div>

      {/* Center Timeline Node */}
      <div className="hidden md:flex items-start justify-center w-0 shrink-0 relative z-20">
        <div className="absolute top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0d0d0d] border-2 border-accent flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,107,53,0.9)] transition-all duration-300">
          <div className={`w-2 h-2 rounded-full ${exp.current ? "bg-emerald-400 animate-pulse" : "bg-accent"}`} />
        </div>
      </div>

      {/* Mobile Date Header */}
      <div className="md:hidden flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-accent font-display font-bold text-xs">{formatted}</span>
          {durationText && <span className="text-portfolio-muted text-xs font-mono">{durationText}</span>}
        </div>
        {exp.current && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
            Active
          </span>
        )}
      </div>

      {/* Right Column: Experience Card */}
      <div className="flex-1 md:pl-12 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-accent/40 shadow-2xl transition-all duration-500 overflow-hidden group/card"
        >
          {/* Subtle Ambient Glow inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover/card:bg-accent/20 transition-all duration-700" />
          
          <div className="relative z-10">
            
            {/* Header: Position & Company */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover/card:border-accent/40 transition-colors">
                  <RoleIcon className={`w-6 h-6 ${roleMeta.color}`} />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-xl sm:text-2xl tracking-tight leading-snug group-hover/card:text-accent transition-colors">
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-portfolio-muted font-medium text-sm">
                      {exp.company}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Pill */}
              <span className={`px-3.5 py-1 rounded-full border text-xs font-display font-bold tracking-wider uppercase whitespace-nowrap ${roleMeta.badgeBg}`}>
                {roleMeta.type}
              </span>
            </div>

            {/* Bullet Point Highlights / Description */}
            <div className="space-y-2.5 mb-6">
              {lines.length > 1 ? (
                lines.slice(0, isExpanded ? lines.length : 2).map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent/80 shrink-0 mt-1" />
                    <p className="text-portfolio-text-sec text-sm sm:text-[15px] leading-relaxed">
                      {bullet}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-portfolio-text-sec text-sm sm:text-[15px] leading-relaxed">
                  {rawDesc || "Contributed to high-impact web engineering solutions and application architecture."}
                </p>
              )}
            </div>

            {/* Read More Toggle if many bullet points */}
            {lines.length > 2 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-accent hover:text-accent/80 uppercase tracking-wider mb-6 transition-colors"
              >
                <span>{isExpanded ? "Show Less" : `View Full Scope (${lines.length - 2} more)`}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Tech Stack Chips Row */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-accent" />
                Stack:
              </span>
              {skills.map((skill: string) => {
                const conf = KNOWN_SKILLS[skill] || {
                  bg: "bg-white/5 border-white/10",
                  text: "text-white/80",
                  dot: "bg-accent",
                };

                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-medium transition-transform hover:scale-105 ${conf.bg} ${conf.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                    {skill}
                  </span>
                );
              })}
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
};

export const Experience = () => {
  const { data: dbExperiences, isLoading } = useExperience();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Use database experiences if present, otherwise fall back to comprehensive seeds
  const experiences = useMemo(() => {
    if (dbExperiences && dbExperiences.length > 0) {
      return dbExperiences;
    }
    return fallbackExperiences;
  }, [dbExperiences]);

  // Available filter categories
  const categories = ["All", "Engineering", "Internship", "Competition"];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return experiences;
    return experiences.filter((exp) => {
      const cat = categorizeRole(exp.position).type;
      return cat.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [experiences, activeFilter]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-background text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs uppercase tracking-widest text-portfolio-muted font-mono">Loading Experience...</span>
      </div>
    );
  }

  return (
    <section id="experience" className="py-28 bg-background relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent font-display text-xs font-semibold tracking-widest uppercase mb-4"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Career Journey & Impact
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-[1.05]"
            >
              Professional <br className="hidden sm:inline" />
              <span className="text-accent">Experience.</span>
            </motion.h2>
          </div>

          {/* Quick Metrics & Interactive Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <div className="flex items-center gap-3 text-xs font-mono text-portfolio-muted">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-white/80">
                <Clock className="w-3.5 h-3.5 text-accent" />
                2+ Years Experience
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-white/80">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Full-Stack Delivery
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    activeFilter === cat
                      ? "bg-accent text-black shadow-[0_0_15px_rgba(255,107,53,0.4)]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline Stream */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {filtered.map((exp, index) => (
              <ExperienceCard 
                key={exp.id} 
                exp={exp} 
                index={index} 
                isLast={index === filtered.length - 1} 
              />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 glass-card rounded-3xl border border-white/10 p-8">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h3 className="font-display font-bold text-white text-base uppercase">No roles in this category</h3>
              <p className="text-portfolio-muted text-xs mt-1">Select "All" to view all career milestones</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Experience;
