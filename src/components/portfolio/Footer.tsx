import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/integrations/supabase/hooks";

export const Footer = () => {
  const { data: profile } = useProfile();

  const socials = [
    { icon: Github, href: profile?.github_url || "#", label: "GitHub" },
    { icon: Linkedin, href: profile?.linkedin_url || "#", label: "LinkedIn" },
    { icon: Twitter, href: profile?.twitter_url || "#", label: "Twitter" },
  ];

  return (
    <footer className="py-12 border-t border-white/10 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="font-display font-black tracking-[-0.04em] text-xl text-white mb-2 uppercase">
              {profile?.full_name?.split(" ")[0] || "Portfolio"}
              <span className="text-accent">.</span>
            </div>
            <p className="font-body font-medium text-portfolio-muted text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </motion.div>

          {/* Large Email Link */}
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            href={`mailto:${profile?.email || "hello@example.com"}`}
            className="group relative px-8 py-4 bg-white/5 rounded-full border border-white/10 hover:border-accent hover:bg-accent/10 transition-colors flex items-center gap-4"
          >
            <Mail className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
            <span className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-white group-hover:text-accent transition-colors">Start a conversation</span>
            <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-accent hover:bg-accent hover:text-black text-white transition-all group"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
            <div className="w-px h-8 bg-white/10 mx-2" />
            <a 
              href="/admin" 
              className="font-display font-medium tracking-[0.1em] text-xs uppercase text-portfolio-muted hover:text-accent transition-colors"
            >
              Admin
            </a>
          </motion.div>

        </div>
      </div>
    </footer>
  );
};
