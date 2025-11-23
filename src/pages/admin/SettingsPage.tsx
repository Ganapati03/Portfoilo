import { motion } from "framer-motion";
import { Save, Github, Linkedin, Twitter, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-foreground/60">Manage your portfolio settings and preferences</p>
      </motion.div>

      <div className="max-w-3xl space-y-6">
        {/* Contact Information */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input 
                type="email"
                defaultValue="john.doe@example.com"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input 
                defaultValue="+1 (555) 123-4567"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                defaultValue="San Francisco, CA"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Social Media Links</h3>
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Label>
              <Input 
                placeholder="https://github.com/username"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input 
                placeholder="https://linkedin.com/in/username"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter
              </Label>
              <Input 
                placeholder="https://twitter.com/username"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable AI Chatbot</Label>
                <p className="text-sm text-foreground/60">Allow visitors to chat with AI assistant</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Contact Form</Label>
                <p className="text-sm text-foreground/60">Enable contact form submissions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-foreground/60">Receive email for new messages</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* SEO */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <Label>Meta Title</Label>
              <Input 
                defaultValue="John Doe - Full Stack Developer Portfolio"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Input 
                defaultValue="Portfolio showcasing full stack development projects and expertise"
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
          </div>
        </Card>

        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
