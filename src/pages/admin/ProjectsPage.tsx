import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    tech: ["React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400",
  },
  {
    id: 2,
    title: "AI Chat Application",
    description: "Real-time chat app with AI-powered responses",
    tech: ["Next.js", "OpenAI", "WebSocket"],
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
  },
];

const ProjectsPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Projects</h1>
          <p className="text-foreground/60">Manage your portfolio projects</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <Label>Project Title</Label>
                <Input placeholder="e.g., E-Commerce Platform" className="glass border-primary/30 rounded-xl mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Brief description of the project"
                  rows={3}
                  className="glass border-primary/30 rounded-xl mt-1 resize-none"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input placeholder="https://..." className="glass border-primary/30 rounded-xl mt-1" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Live Demo URL</Label>
                  <Input placeholder="https://..." className="glass border-primary/30 rounded-xl mt-1" />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input placeholder="https://github.com/..." className="glass border-primary/30 rounded-xl mt-1" />
                </div>
              </div>
              <div>
                <Label>Technologies (comma-separated)</Label>
                <Input placeholder="React, Node.js, MongoDB" className="glass border-primary/30 rounded-xl mt-1" />
              </div>
              <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                Add Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="glass-strong border border-primary/20 overflow-hidden group">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs rounded-full glass border border-primary/30">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 rounded-xl border-primary/50">
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl border-destructive/50 hover:bg-destructive/10">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
