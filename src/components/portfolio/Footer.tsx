import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const socials = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="py-12 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
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
                className="p-3 glass rounded-xl border border-primary/20 hover:glow-cyan transition-all hover:-translate-y-1"
              >
                <social.icon className="w-5 h-5 text-primary" />
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-foreground/50"
          >
            <p>© 2024 John Doe. All rights reserved.</p>
            <p className="mt-2">Built with React, TailwindCSS & Framer Motion</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
