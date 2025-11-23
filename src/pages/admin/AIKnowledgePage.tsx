import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Brain, Loader2 } from "lucide-react";
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
import { useAIKnowledge, useAddAIKnowledge, useDeleteAIKnowledge } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const AIKnowledgePage = () => {
  const { data: knowledgeItems, isLoading } = useAIKnowledge();
  const addKnowledge = useAddAIKnowledge();
  const deleteKnowledge = useDeleteAIKnowledge();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    topic: "",
    description: "",
  });

  const handleAddKnowledge = () => {
    if (!newItem.topic) {
      toast.error("Topic/Question is required");
      return;
    }

    addKnowledge.mutate({
      topic: newItem.topic,
      description: newItem.description,
      proficiency: 0 // Default value
    }, {
      onSuccess: () => {
        toast.success("Knowledge item added successfully");
        setIsDialogOpen(false);
        setNewItem({ topic: "", description: "" });
      },
      onError: (error) => {
        toast.error(`Error adding knowledge: ${error.message}`);
      }
    });
  };

  const handleDeleteKnowledge = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteKnowledge.mutate(id, {
        onSuccess: () => {
          toast.success("Knowledge item deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting item: ${error.message}`);
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
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">AI Knowledge Base</h1>
            <p className="text-foreground/60">Train the AI chatbot with custom Q&A pairs</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
                <Plus className="w-4 h-4 mr-2" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-primary/20">
              <DialogHeader>
                <DialogTitle className="gradient-text">Add Knowledge Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Question / Topic</Label>
                  <Input 
                    placeholder="e.g., What is your experience?" 
                    className="glass border-primary/30 rounded-xl mt-1" 
                    value={newItem.topic}
                    onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Answer / Description</Label>
                  <Textarea 
                    placeholder="Provide a detailed answer"
                    rows={4}
                    className="glass border-primary/30 rounded-xl mt-1 resize-none"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <Button 
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                  onClick={handleAddKnowledge}
                  disabled={addKnowledge.isPending}
                >
                  {addKnowledge.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add to Knowledge Base
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass p-4 border border-primary/20 mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground/70">
              The AI chatbot will use these Q&A pairs to provide accurate responses to visitors.
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="space-y-4 max-w-4xl">
        {knowledgeItems?.map((item) => (
          <Card key={item.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">{item.topic}</h3>
                    <p className="text-sm text-foreground/70">{item.description}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDeleteKnowledge(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {knowledgeItems?.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No knowledge items found. Add some Q&A pairs!
          </div>
        )}
      </div>
    </div>
  );
};

export default AIKnowledgePage;
