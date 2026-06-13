import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useProjects } from "@/integrations/supabase/hooks";

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax for the image inside the card
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative w-full h-[60vh] md:h-[80vh] rounded-[2rem] overflow-hidden bg-secondary border border-white/10"
    >
      {/* Background Image with Parallax and Zoom */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="font-display font-medium tracking-[0.1em] uppercase text-portfolio-muted text-xs">No Image</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Glass Info Panel */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
        <div className="glass-card p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-black/40 group-hover:bg-black/60 transition-colors duration-500 translate-y-4 group-hover:translate-y-0 opacity-90 group-hover:opacity-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-3xl md:text-5xl font-display font-semibold tracking-[-0.02em] leading-[1.2] text-white mb-4">
                {project.title}
              </h3>
              <p className="font-body font-normal md:font-medium text-white/70 leading-[1.7] text-lg md:text-xl mb-6 max-w-2xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                {project.description}
              </p>
              
              {/* Animated Tags */}
              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tech: string, i: number) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="px-4 py-2 font-display font-medium tracking-[0.1em] text-xs uppercase rounded-full border border-white/20 text-white bg-white/5 backdrop-blur-md"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 shrink-0">
              {project.github_url && (
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
              )}
              {project.demo_url && (
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-accent border border-accent flex items-center justify-center text-black hover:bg-white hover:border-white transition-colors"
                >
                  <ExternalLink className="w-6 h-6" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
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
          className="mb-20 text-center"
        >
          <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-accent mb-4 block">
            Selected Works
          </span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white">
            Featured Projects
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12 md:gap-24">
          {projects?.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          {projects?.length === 0 && (
            <div className="font-body font-normal md:font-medium text-portfolio-muted leading-[1.7] text-lg py-12 text-center">
              No projects to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
