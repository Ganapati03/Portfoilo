import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";
import { useProfile } from "@/integrations/supabase/hooks";

export const Hero = () => {
  const { data: profile, isLoading } = useProfile();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-50 animate-glow-pulse" />
              <img
                src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
                alt="Profile"
                className="relative w-32 h-32 rounded-full border-4 border-primary/50 glow-cyan object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Hi, I'm <span className="gradient-text">{profile?.full_name || "John Doe"}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto"
          >
            {profile?.title || "Full Stack Developer • UI/UX Enthusiast • Problem Solver"}
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              onClick={() => scrollToSection("projects")}
              size="lg"
              className="glass-strong hover:glow-cyan text-lg px-8 py-6 rounded-2xl border-2 border-primary/50"
            >
              View Projects
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl border-2 border-secondary/50 hover:glow-purple"
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
