import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/integrations/supabase/hooks";

export const Footer = () => {
  const { data: profile } = useProfile();

  const socials = [
    { icon: Github, href: profile?.github_url || "#", label: "GitHub" },
    { icon: Linkedin, href: profile?.linkedin_url || "#", label: "LinkedIn" },
    { icon: Twitter, href: profile?.twitter_url || "#", label: "Twitter" },
    { icon: Mail, href: profile?.email ? `mailto:${profile.email}` : "#", label: "Email" },
  ];

  return (
    <footer className="py-12 border-t border-portfolio-border bg-portfolio-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.label !== "Email" ? "_blank" : undefined}
                rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                className="p-3 bg-portfolio-card rounded-xl border border-portfolio-border hover:border-portfolio-border-accent transition-all hover:-translate-y-1 hover:bg-portfolio-accent/5 group"
              >
                <social.icon className="w-5 h-5 text-portfolio-muted group-hover:text-portfolio-accent transition-colors" />
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-portfolio-muted font-medium"
          >
            <p>© {new Date().getFullYear()} {profile?.full_name || "John Doe"}. All rights reserved.</p>
            <p className="mt-2 text-portfolio-muted/70">Designed for the future.</p>
            <a 
              href="/admin" 
              className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-portfolio-text-sec hover:text-portfolio-accent transition-colors"
            >
              Admin Panel
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
