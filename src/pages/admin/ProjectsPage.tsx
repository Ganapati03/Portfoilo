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
import { useProjects, useAddProject, useUpdateProject, useDeleteProject, useUploadImage } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const ProjectsPage = () => {
  const { data: projects, isLoading } = useProjects();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const uploadImage = useUploadImage();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: "", // Will be converted to array
  });

  const resetForm = () => {
    setNewProject({
      title: "",
      description: "",
      image_url: "",
      demo_url: "",
      github_url: "",
      tags: "",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadImage.mutateAsync({ file, bucket: "portfolio" });
      setNewProject({ ...newProject, image_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProject = () => {
    if (!newProject.title) {
      toast.error("Project title is required");
      return;
    }

    const projectData = {
      ...newProject,
      tags: newProject.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    if (editingId) {
      updateProject.mutate({
        id: editingId,
        ...projectData
      }, {
        onSuccess: () => {
          toast.success("Project updated successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error updating project: ${error.message}`);
        }
      });
    } else {
      addProject.mutate(projectData, {
        onSuccess: () => {
          toast.success("Project added successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error adding project: ${error.message}`);
        }
      });
    }
  };

  const handleEditProject = (project: any) => {
    setNewProject({
      title: project.title,
      description: project.description || "",
      image_url: project.image_url || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      tags: project.tags ? project.tags.join(", ") : "",
    });
    setEditingId(project.id);
    setIsDialogOpen(true);
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

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
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
        
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              onClick={() => {
                setEditingId(null);
                setNewProject({
                  title: "",
                  description: "",
                  image_url: "",
                  demo_url: "",
                  github_url: "",
                  tags: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="glass border-primary/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="glass border-primary/30"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Project Image</Label>
                <div className="flex items-center gap-4">
                  {newProject.image_url && (
                    <img 
                      src={newProject.image_url} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-md object-cover border border-primary/20"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="glass border-primary/30 cursor-pointer"
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      {uploading ? "Uploading..." : "Upload project screenshot"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo">Demo URL</Label>
                  <Input
                    id="demo"
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    className="glass border-primary/30"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="glass border-primary/30"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  className="glass border-primary/30"
                  placeholder="React, TypeScript, Tailwind..."
                />
              </div>
              <Button 
                onClick={handleSaveProject} 
                className="bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
                disabled={addProject.isPending || updateProject.isPending || uploading}
              >
                {(addProject.isPending || updateProject.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Project" : "Save Project"}
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 rounded-xl border-primary/50"
                  onClick={() => handleEditProject(project)}
                >
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
