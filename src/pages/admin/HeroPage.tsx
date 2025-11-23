import { motion } from "framer-motion";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/integrations/supabase/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const HeroPage = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "", // Using bio for the description
    avatar_url: "",
    resume_url: "", // Not used in this specific form but part of profile
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        resume_url: profile.resume_url || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(`Error updating profile: ${error.message}`);
      },
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Hero Section</h1>
        <p className="text-foreground/60">Manage your hero section content</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Hero Content
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input 
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="title">Title/Role</Label>
              <Input 
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio / Description</Label>
              <Input 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url">Profile Image URL</Label>
              <Input 
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="glass border-primary/30 rounded-xl mt-1"
              />
            </div>

            <Button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
            >
              {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </form>
        </Card>

        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-6">Preview</h3>
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <img
              src={formData.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
              alt="Preview"
              className="w-24 h-24 rounded-full mx-auto border-4 border-primary/50 object-cover"
            />
            <h2 className="text-3xl font-bold">
              Hi, I'm <span className="gradient-text">{formData.full_name || "Your Name"}</span>
            </h2>
            <p className="text-foreground/70">
              {formData.title || "Your Title"}
            </p>
            <p className="text-sm text-foreground/50 max-w-md mx-auto">
              {formData.bio}
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
