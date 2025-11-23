import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

const skills = [
  { id: 1, name: "React", category: "Frontend" },
  { id: 2, name: "TypeScript", category: "Frontend" },
  { id: 3, name: "Node.js", category: "Backend" },
  { id: 4, name: "PostgreSQL", category: "Backend" },
  { id: 5, name: "Figma", category: "Design" },
  { id: 6, name: "Docker", category: "Tools" },
];

const SkillsPage = () => {
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
        
        <Dialog>
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
                <Input placeholder="e.g., React" className="glass border-primary/30 rounded-xl mt-1" />
              </div>
              <div>
                <Label>Category</Label>
                <Input placeholder="e.g., Frontend" className="glass border-primary/30 rounded-xl mt-1" />
              </div>
              <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
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
            {skills.map((skill) => (
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SkillsPage;
