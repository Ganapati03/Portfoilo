import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
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

const certifications = [
  { id: 1, title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
  { id: 2, title: "Professional Scrum Master I", issuer: "Scrum.org", date: "2023" },
  { id: 3, title: "Google Cloud Professional", issuer: "Google Cloud", date: "2022" },
  { id: 4, title: "Meta Front-End Developer", issuer: "Meta", date: "2022" },
];

const CertificationsPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Certifications</h1>
          <p className="text-foreground/60">Manage your certifications and credentials</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New Certification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Certification Title</Label>
                <Input 
                  placeholder="e.g., AWS Certified Solutions Architect" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Issuing Organization</Label>
                <Input 
                  placeholder="e.g., Amazon Web Services" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input 
                  placeholder="e.g., 2023" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <div>
                <Label>Credential URL</Label>
                <Input 
                  placeholder="https://..." 
                  className="glass border-primary/30 rounded-xl mt-1" 
                />
              </div>
              <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                Add Certification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1 line-clamp-2">{cert.title}</h3>
                <p className="text-sm text-foreground/60">{cert.issuer}</p>
                <p className="text-xs text-foreground/40 mt-1">{cert.date}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 rounded-xl border-primary/50 hover:glow-cyan"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl border-destructive/50 hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPage;
