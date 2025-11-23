import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSkills, useAddSkill, useDeleteSkill } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const SkillsPage = () => {
  const { data: skills, isLoading } = useSkills();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category) {
      toast.error("Please fill in all fields");
      return;
    }
    addSkill.mutate(newSkill, {
      onSuccess: () => {
        toast.success("Skill added successfully");
        setIsDialogOpen(false);
        setNewSkill({ name: "", category: "" });
      },
      onError: (error) => {
        toast.error(`Error adding skill: ${error.message}`);
      }
    });
  };

  const handleDeleteSkill = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteSkill.mutate(id, {
        onSuccess: () => {
          toast.success("Skill deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting skill: ${error.message}`);
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
          <h1 className="text-4xl font-bold gradient-text mb-2">Skills</h1>
          <p className="text-foreground/60">Manage your skills and expertise</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Skill Name</Label>
                <Input 
                  placeholder="e.g., React" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input 
                  placeholder="e.g., Frontend" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                />
              </div>
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                onClick={handleAddSkill}
                disabled={addSkill.isPending}
              >
                {addSkill.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="glass-strong border border-primary/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20 hover:bg-transparent">
              <TableHead className="text-primary">Skill Name</TableHead>
              <TableHead className="text-primary">Category</TableHead>
              <TableHead className="text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills?.map((skill) => (
              <TableRow key={skill.id} className="border-primary/10 hover:bg-primary/5">
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full glass border border-primary/30 text-xs">
                    {skill.category}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                      // Add edit functionality later if needed
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {skills?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-foreground/50">
                  No skills found. Add some skills to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SkillsPage;
