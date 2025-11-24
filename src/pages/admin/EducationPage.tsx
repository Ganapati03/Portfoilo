import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, GraduationCap, Loader2 } from "lucide-react";
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
import { useEducation, useAddEducation, useUpdateEducation, useDeleteEducation } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const EducationPage = () => {
  const { data: education, isLoading } = useEducation();
  const addEducation = useAddEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
  });

  const resetForm = () => {
    setNewEducation({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      grade: "",
      description: "",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleSaveEducation = () => {
    if (!newEducation.institution || !newEducation.degree) {
      toast.error("Institution and Degree are required");
      return;
    }

    const educationData = {
      ...newEducation,
      start_date: newEducation.start_date || null,
      end_date: newEducation.end_date || null,
      grade: newEducation.grade || null,
      description: newEducation.description || null,
    };

    if (editingId) {
      updateEducation.mutate({
        id: editingId,
        ...educationData
      }, {
        onSuccess: () => {
          toast.success("Education updated successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error updating education: ${error.message}`);
        }
      });
    } else {
      addEducation.mutate(educationData, {
        onSuccess: () => {
          toast.success("Education added successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error adding education: ${error.message}`);
        }
      });
    }
  };

  const handleEditEducation = (edu: any) => {
    setNewEducation({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      grade: edu.grade || "",
      description: edu.description || "",
    });
    setEditingId(edu.id);
    setIsDialogOpen(true);
  };

  const handleDeleteEducation = (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      deleteEducation.mutate(id, {
        onSuccess: () => {
          toast.success("Education deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting education: ${error.message}`);
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
          <h1 className="text-4xl font-bold gradient-text mb-2">Education</h1>
          <p className="text-foreground/60">Manage your academic background</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              onClick={() => {
                setEditingId(null);
                setNewEducation({
                  institution: "",
                  degree: "",
                  field_of_study: "",
                  start_date: "",
                  end_date: "",
                  grade: "",
                  description: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">{editingId ? "Edit Education" : "Add New Education"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Institution</Label>
                <Input 
                  placeholder="e.g., University of Technology" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input 
                    placeholder="e.g., Bachelor's" 
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input 
                    placeholder="e.g., Computer Science" 
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newEducation.field_of_study}
                    onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input 
                    type="date"
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newEducation.start_date}
                    onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input 
                    type="date"
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newEducation.end_date}
                    onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Grade / GPA (Optional)</Label>
                <Input 
                  placeholder="e.g., 3.8/4.0 or First Class" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newEducation.grade}
                  onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Brief description of activities, societies, etc."
                  rows={3}
                  className="glass border-primary/30 rounded-xl mt-1 resize-none"
                  value={newEducation.description}
                  onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                />
              </div>
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                onClick={handleSaveEducation}
                disabled={addEducation.isPending || updateEducation.isPending}
              >
                {(addEducation.isPending || updateEducation.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="space-y-4 max-w-4xl">
        {education?.map((edu) => (
          <Card key={edu.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-sm text-primary">{edu.institution}</p>
                    <p className="text-xs text-foreground/50 mt-1">
                      {edu.field_of_study} • {edu.start_date} - {edu.end_date || "Present"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                      onClick={() => handleEditEducation(edu)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDeleteEducation(edu.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {edu.grade && <p className="text-xs font-semibold text-secondary mt-1">Grade: {edu.grade}</p>}
                <p className="text-sm text-foreground/70 mt-2">{edu.description}</p>
              </div>
            </div>
          </Card>
        ))}
        {education?.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No education records found. Add your academic history!
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;
