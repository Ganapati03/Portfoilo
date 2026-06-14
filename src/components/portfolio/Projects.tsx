import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useProjects } from "@/integrations/supabase/hooks";

const cardThemes = [
  {
    buttonBg: "bg-[#C55741]",
    buttonHover: "hover:bg-[#a64733]",
    priceBg: "bg-[#C55741]",
    tagBg: "bg-[#FDDED2]",
    tagText: "text-[#C55741]",
  },
  {
    buttonBg: "bg-[#518291]",
    buttonHover: "hover:bg-[#3f6774]",
    priceBg: "bg-[#518291]",
    tagBg: "bg-[#A7E8F6]",
    tagText: "text-[#518291]",
  },
  {
    buttonBg: "bg-[#FF8A68]",
    buttonHover: "hover:bg-[#e06b49]",
    priceBg: "bg-[#FF8A68]",
    tagBg: "bg-[#FFD6CA]",
    tagText: "text-[#FF8A68]",
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const theme = cardThemes[index % cardThemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gradient-to-br from-[#FFF3EB] to-[#FFE6D6] rounded-[2rem] p-4 sm:p-5 flex flex-col group shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 border border-[#FFD6C2]/30"
    >
      {/* Image container */}
      <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-100 mb-6 shrink-0">
        {project.image_url ? (
          <div className="absolute inset-0 w-full h-full">
            {/* Base Image: Grayscale & darkened */}
            <img
              src={project.image_url}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.8] grayscale"
            />
            {/* Hover Image: Colored wipe animation */}
            <img
              src={project.image_url}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-[350ms] ease-[cubic-bezier(0.19,1,0.22,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}

        {/* Category Tab */}
        <div className="absolute top-0 left-0 bg-[#FFF3EB] rounded-br-[1.5rem] px-5 py-2.5 z-10 flex items-center justify-center">
          <span className="text-gray-600 font-medium text-[13px] tracking-wide">
            {project.tags?.[0] || 'Project'}
          </span>
          
          {/* SVG Inverted corners */}
          <svg className="absolute top-0 -right-[20px] w-[20px] h-[20px] fill-[#FFF3EB]" viewBox="0 0 20 20">
            <path d="M0,0 H20 A20,20 0 0,0 0,20 V0 Z" />
          </svg>
          <svg className="absolute -bottom-[20px] left-0 w-[20px] h-[20px] fill-[#FFF3EB]" viewBox="0 0 20 20">
            <path d="M0,0 H20 A20,20 0 0,0 0,20 V0 Z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-2">
        <div className="flex justify-between items-center mb-3 gap-4">
          <h3 className="text-xl sm:text-[22px] font-bold text-gray-900 line-clamp-1 tracking-tight">
            {project.title}
          </h3>
          <div className={`px-4 py-1 ${theme.priceBg} text-white text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap shrink-0`}>
            {project.demo_url ? 'Live' : 'Code'}
          </div>
        </div>

        <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed line-clamp-3 mb-6 flex-1 font-body">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags?.slice(1, 4).map((tech: string) => (
            <span
              key={tech}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide ${theme.tagBg} ${theme.tagText}`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <a
          href={project.demo_url || project.github_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 sm:py-4 rounded-[1.25rem] ${theme.buttonBg} ${theme.buttonHover} transition-colors duration-300 text-white font-bold text-sm sm:text-[15px] flex items-center justify-center gap-2`}
        >
          {project.demo_url ? <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> : <Github className="w-4 h-4 sm:w-5 sm:h-5" />}
          View Details
        </a>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section id="projects" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 text-center"
        >
          <span className="font-display font-medium tracking-[0.1em] text-[10px] sm:text-xs uppercase text-accent mb-4 block">
            Selected Works
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl tracking-[-0.03em] leading-[1.1] text-white">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects?.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          {projects?.length === 0 && (
            <div className="font-body font-normal md:font-medium text-portfolio-muted leading-[1.7] text-lg py-12 text-center col-span-full">
              No projects to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
