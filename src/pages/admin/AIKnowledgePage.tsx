import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Brain } from "lucide-react";
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

const knowledgeItems = [
  { id: 1, question: "What technologies do you specialize in?", answer: "I specialize in React, Node.js, TypeScript, and cloud technologies." },
  { id: 2, question: "How can I contact you?", answer: "You can reach me via email at john.doe@example.com or through the contact form." },
  { id: 3, question: "Are you available for freelance work?", answer: "Yes, I'm currently available for select freelance projects." },
];

const AIKnowledgePage = () => {
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
          
          <Dialog>
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
                  <Label>Question</Label>
                  <Input 
                    placeholder="e.g., What is your experience?" 
                    className="glass border-primary/30 rounded-xl mt-1" 
                  />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea 
                    placeholder="Provide a detailed answer"
                    rows={4}
                    className="glass border-primary/30 rounded-xl mt-1 resize-none"
                  />
                </div>
                <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
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
        {knowledgeItems.map((item) => (
          <Card key={item.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">{item.question}</h3>
                    <p className="text-sm text-foreground/70">{item.answer}</p>
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
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIKnowledgePage;
