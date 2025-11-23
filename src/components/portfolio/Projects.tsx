import { motion } from "framer-motion";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/integrations/supabase/hooks";

export const Projects = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, rotateX: 5 }}
              className="glass-strong rounded-2xl overflow-hidden border border-primary/20 glow-hover-cyan group"
            >
              <div className="relative overflow-hidden h-48">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-foreground/50">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>
                <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full glass border border-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.demo_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-primary/50 hover:glow-cyan"
                      asChild
                    >
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-secondary/50 hover:glow-purple"
                      asChild
                    >
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {projects?.length === 0 && (
            <div className="col-span-full text-center text-foreground/50">
              No projects to display.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
