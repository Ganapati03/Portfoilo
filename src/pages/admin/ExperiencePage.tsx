import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Briefcase, Trophy } from "lucide-react";
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

const experiences = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Tech Corp",
    period: "2022 - Present",
    type: "work",
  },
  {
    id: 2,
    title: "Won AI Hackathon",
    company: "TechFest 2023",
    period: "Nov 2023",
    type: "hackathon",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    type: "work",
  },
];

const ExperiencePage = () => {
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger className="glass border-primary/30 rounded-xl mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-primary/20">
                    <SelectItem value="work">Work Experience</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title/Position</Label>
                <Input 
                  placeholder="e.g., Senior Developer" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Company/Event</Label>
                <Input 
                  placeholder="e.g., Tech Corp" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input 
                  placeholder="e.g., 2022 - Present" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Brief description"
                  rows={3}
                  className="glass border-primary/30 rounded-xl mt-1 resize-none"
                />
              </div>
              <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                Add Experience
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="space-y-4 max-w-4xl">
        {experiences.map((exp) => (
          <Card key={exp.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                exp.type === "hackathon" 
                  ? "bg-secondary/20" 
                  : "bg-primary/20"
              }`}>
                {exp.type === "hackathon" ? (
                  <Trophy className="w-6 h-6 text-secondary" />
                ) : (
                  <Briefcase className="w-6 h-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-xs text-foreground/50 mt-1">{exp.period}</p>
                  </div>
                  
                  <div className="flex gap-2">
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

export default ExperiencePage;
