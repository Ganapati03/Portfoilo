import { motion } from "framer-motion";
import { Save, Github, Linkedin, Twitter, Mail as MailIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile, useUpdateProfile } from "@/integrations/supabase/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    email: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    gemini_api_key: "",
    registration_enabled: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        gemini_api_key: profile.gemini_api_key || "",
        registration_enabled: profile.registration_enabled || false,
      });
    }
  }, [profile]);

  const handleSave = () => {
    if (!profile) return;

    updateProfile.mutate({
      ...profile,
      email: formData.email,
      github_url: formData.github_url,
      linkedin_url: formData.linkedin_url,
      twitter_url: formData.twitter_url,
      gemini_api_key: formData.gemini_api_key,
      registration_enabled: formData.registration_enabled,
      updated_at: new Date().toISOString(),
    }, {
      onSuccess: () => {
        toast.success("Settings updated successfully");
      },
      onError: (error) => {
        toast.error(`Error updating settings: ${error.message}`);
      }
    });
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
            {/* Phone and Location are not in the schema yet */}
            <div>
              <Label>Phone Number (Not persisted)</Label>
              <Input 
                defaultValue="+1 (555) 123-4567"
                className="glass border-primary/30 rounded-xl mt-1"
                disabled
              />
            </div>
            <div>
              <Label>Location (Not persisted)</Label>
              <Input 
                defaultValue="San Francisco, CA"
                className="glass border-primary/30 rounded-xl mt-1"
                disabled
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
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
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
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
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
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <Label>Gemini API Key</Label>
              <Input 
                type="password"
                placeholder="AIzaSy..."
                value={formData.gemini_api_key}
                onChange={(e) => setFormData({ ...formData, gemini_api_key: e.target.value })}
                className="glass border-primary/30 rounded-xl mt-1"
              />
              <p className="text-xs text-foreground/50 mt-1">
                Required for the AI Chatbot to function. Keys are stored securely.
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Registration</Label>
                <p className="text-sm text-foreground/60">Allow new users to sign up (Admin only)</p>
              </div>
              <Switch 
                checked={formData.registration_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, registration_enabled: checked })}
              />
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

        {/* SEO - UI Only for now */}
        <Card className="glass-strong p-6 border border-primary/20 opacity-50 pointer-events-none">
          <h3 className="text-xl font-bold mb-6">SEO Settings (Coming Soon)</h3>
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

        <Button 
          className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
