import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
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
import { useProjects, useAddProject, useDeleteProject } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const ProjectsPage = () => {
  const { data: projects, isLoading } = useProjects();
  const addProject = useAddProject();
  const deleteProject = useDeleteProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: "", // Will be converted to array
  });

  const handleAddProject = () => {
    if (!newProject.title) {
      toast.error("Project title is required");
      return;
    }

    const projectData = {
      ...newProject,
      tags: newProject.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    addProject.mutate(projectData, {
      onSuccess: () => {
        toast.success("Project added successfully");
        setIsDialogOpen(false);
        setNewProject({
          title: "",
          description: "",
          image_url: "",
          demo_url: "",
          github_url: "",
          tags: "",
        });
      },
      onError: (error) => {
        toast.error(`Error adding project: ${error.message}`);
      }
    });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate(id, {
        onSuccess: () => {
          toast.success("Project deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting project: ${error.message}`);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Input 
                  placeholder="e.g., E-Commerce Platform" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Brief description of the project"
                  rows={3}
                  className="glass border-primary/30 rounded-xl mt-1 resize-none"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input 
                  placeholder="https://..." 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newProject.image_url}
                  onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Live Demo URL</Label>
                  <Input 
                    placeholder="https://..." 
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input 
                    placeholder="https://github.com/..." 
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Technologies (comma-separated)</Label>
                <Input 
                  placeholder="React, Node.js, MongoDB" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                />
              </div>
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                onClick={handleAddProject}
                disabled={addProject.isPending}
              >
                {addProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="glass-strong border border-primary/20 overflow-hidden group">
            {project.image_url && (
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((tech) => (
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {projects?.length === 0 && (
          <div className="col-span-full text-center py-12 text-foreground/50">
            No projects found. Add your first project!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
