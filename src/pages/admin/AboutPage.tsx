import { motion } from "framer-motion";
import { Pencil, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, useUpdateProfile } from "@/integrations/supabase/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const AboutPage = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    if (!profile) return;

    updateProfile.mutate({
      ...profile,
      bio: formData.bio,
      avatar_url: formData.avatar_url,
      updated_at: new Date().toISOString(),
    }, {
      onSuccess: () => {
        toast.success("About section updated successfully");
      },
      onError: (error) => {
        toast.error(`Error updating about section: ${error.message}`);
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
            <Label>Bio / Description</Label>
            <Textarea 
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={6}
              className="glass border-primary/30 rounded-xl mt-1 resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-foreground/50 mt-1">
              This text will be displayed in the About section. You can use newlines for paragraphs.
            </p>
          </div>

          <div>
            <Label>Profile Image URL</Label>
            <Input 
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="glass border-primary/30 rounded-xl mt-1"
              placeholder="https://..."
            />
          </div>

          <Button 
            className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
