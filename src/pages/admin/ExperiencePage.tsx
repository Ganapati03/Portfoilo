import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Briefcase, Trophy, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExperience, useAddExperience, useUpdateExperience, useDeleteExperience } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const ExperiencePage = () => {
  const { data: experiences, isLoading } = useExperience();
  const addExperience = useAddExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    current: false,
  });

  const resetForm = () => {
    setNewExperience({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      current: false,
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleSaveExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      toast.error("Company and Position are required");
      return;
    }

    const experienceData = {
      ...newExperience,
      start_date: newExperience.start_date || null,
      end_date: newExperience.end_date || null,
    };

    if (editingId) {
      updateExperience.mutate({
        id: editingId,
        ...experienceData
      }, {
        onSuccess: () => {
          toast.success("Experience updated successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error updating experience: ${error.message}`);
        }
      });
    } else {
      addExperience.mutate(experienceData, {
        onSuccess: () => {
          toast.success("Experience added successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error adding experience: ${error.message}`);
        }
      });
    }
  };

  const handleEditExperience = (exp: any) => {
    setNewExperience({
      company: exp.company,
      position: exp.position,
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
      current: exp.current || false,
    });
    setEditingId(exp.id);
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      deleteExperience.mutate(id, {
        onSuccess: () => {
          toast.success("Experience deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting experience: ${error.message}`);
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
          <h1 className="text-4xl font-bold gradient-text mb-2">Experience</h1>
          <p className="text-foreground/60">Manage your work experience and achievements</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              onClick={() => {
                setEditingId(null);
                setNewExperience({
                  company: "",
                  position: "",
                  start_date: "",
                  end_date: "",
                  description: "",
                  current: false,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">{editingId ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Type selection removed as it's not in the schema, defaulting to work experience style */}
              
              <div>
                <Label>Title/Position</Label>
                <Input 
                  placeholder="e.g., Senior Developer" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                />
              </div>
              <div>
                <Label>Company/Event</Label>
                <Input 
                  placeholder="e.g., Tech Corp" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input 
                    type="date"
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newExperience.start_date}
                    onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input 
                    type="date"
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newExperience.end_date}
                    onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Brief description"
                  rows={3}
                  className="glass border-primary/30 rounded-xl mt-1 resize-none"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                />
              </div>
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                onClick={handleSaveExperience}
                disabled={addExperience.isPending || updateExperience.isPending}
              >
                {(addExperience.isPending || updateExperience.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Experience" : "Add Experience"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="space-y-4 max-w-4xl">
        {experiences?.map((exp) => (
          <Card key={exp.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{exp.position}</h3>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-xs text-foreground/50 mt-1">
                      {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                      onClick={() => handleEditExperience(exp)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDeleteExperience(exp.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mt-2">{exp.description}</p>
              </div>
            </div>
          </Card>
        ))}
        {experiences?.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No experience records found. Add your work history!
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
