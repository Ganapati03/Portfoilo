import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const HeroPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Hero Section</h1>
        <p className="text-foreground/60">Manage your hero section content</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Hero Content
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                defaultValue="John Doe"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Title/Role</Label>
              <Input 
                defaultValue="Full Stack Developer • UI/UX Enthusiast • Problem Solver"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Profile Image URL</Label>
              <Input 
                defaultValue="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Primary Button Text</Label>
              <Input 
                defaultValue="View Projects"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Secondary Button Text</Label>
              <Input 
                defaultValue="Contact Me"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
              Save Changes
            </Button>
          </div>
        </Card>

        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Preview</h3>
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Preview"
              className="w-24 h-24 rounded-full mx-auto border-4 border-primary/50"
            />
            <h2 className="text-3xl font-bold">
              Hi, I'm <span className="gradient-text">John Doe</span>
            </h2>
            <p className="text-foreground/70">
              Full Stack Developer • UI/UX Enthusiast • Problem Solver
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="sm" className="rounded-xl">View Projects</Button>
              <Button size="sm" variant="outline" className="rounded-xl">Contact Me</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeroPage;
