import { motion } from "framer-motion";
import { useProfile } from "@/integrations/supabase/hooks";

export const About = () => {
  const { data: profile } = useProfile();

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-2xl" />
              <div className="relative glass-strong p-8 rounded-3xl glow-hover-cyan">
                <img
                  src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnAbout"}
                  alt="About"
                  className="w-full max-w-sm rounded-2xl object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-foreground">
              Passionate Developer Building Digital Experiences
            </h3>
            <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
              {profile?.bio || "I'm a full-stack developer with a passion for creating beautiful, functional, and user-friendly applications. With expertise in modern web technologies, I transform ideas into elegant solutions."}
            </p>
            {/* 
            <p className="text-foreground/70 leading-relaxed">
              My journey in tech has been driven by curiosity and a desire to continuously learn and improve. I specialize in React, Node.js, and cloud technologies, always staying up-to-date with the latest industry trends.
            </p> 
            */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass p-4 rounded-xl border border-primary/20">
                <div className="text-3xl font-bold gradient-text">5+</div>
                <div className="text-sm text-foreground/60">Years Experience</div>
              </div>
              <div className="glass p-4 rounded-xl border border-secondary/20">
                <div className="text-3xl font-bold gradient-text">50+</div>
                <div className="text-sm text-foreground/60">Projects Completed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
