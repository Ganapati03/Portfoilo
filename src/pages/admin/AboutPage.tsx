import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AboutPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">About Section</h1>
        <p className="text-foreground/60">Manage your about section content</p>
      </motion.div>

      <Card className="glass-strong p-6 border border-primary/20 max-w-4xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Pencil className="w-5 h-5 text-primary" />
          Edit About Content
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label>Heading</Label>
            <Input 
              defaultValue="Passionate Developer Building Digital Experiences"
              className="glass border-primary/30 rounded-xl mt-1"
            />
          </div>

          <div>
            <Label>Description Paragraph 1</Label>
            <Textarea 
              defaultValue="I'm a full-stack developer with a passion for creating beautiful, functional, and user-friendly applications. With expertise in modern web technologies, I transform ideas into elegant solutions."
              rows={3}
              className="glass border-primary/30 rounded-xl mt-1 resize-none"
            />
          </div>

          <div>
            <Label>Description Paragraph 2</Label>
            <Textarea 
              defaultValue="My journey in tech has been driven by curiosity and a desire to continuously learn and improve. I specialize in React, Node.js, and cloud technologies, always staying up-to-date with the latest industry trends."
              rows={3}
              className="glass border-primary/30 rounded-xl mt-1 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Years of Experience</Label>
              <Input 
                type="number"
                defaultValue="5"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Projects Completed</Label>
              <Input 
                type="number"
                defaultValue="50"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
          </div>

          <div>
            <Label>About Image URL</Label>
            <Input 
              defaultValue="https://api.dicebear.com/7.x/avataaars/svg?seed=JohnAbout"
              className="glass border-primary/30 rounded-xl mt-1"
            />
          </div>

          <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
