import { motion } from "framer-motion";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/integrations/supabase/hooks";

export const Projects = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  return (
    <section id="projects" className="py-24 bg-portfolio-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects?.map((project, index) => {
            // Alternate sizes: first is large (span 2), next is small (span 1), etc.
            const isLarge = index % 3 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
                whileHover={{ y: -5 }}
                className={`group glass-card overflow-hidden flex flex-col cursor-pointer ${
                  isLarge ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                <div className="relative h-60 md:h-72 w-full overflow-hidden shrink-0">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-portfolio-secondary flex items-center justify-center">
                      <span className="text-portfolio-muted font-display tracking-widest uppercase">No Image</span>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-portfolio-card to-transparent opacity-80" />
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-portfolio-card transition-colors">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-portfolio-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-portfolio-text-sec text-sm leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium rounded-full border border-portfolio-border-accent text-portfolio-accent bg-portfolio-accent-dim"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-portfolio-text-sec hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-portfolio-text-sec hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {projects?.length === 0 && (
            <div className="col-span-full text-portfolio-muted text-lg py-12">
              No projects to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
