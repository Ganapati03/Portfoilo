import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const certifications = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=aws",
  },
  {
    title: "Professional Scrum Master I",
    issuer: "Scrum.org",
    date: "2023",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=scrum",
  },
  {
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "2022",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=gcp",
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Meta",
    date: "2022",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=meta",
  },
];

export const Certifications = () => {
  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Certifications</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-strong p-6 rounded-2xl border border-primary/20 glow-hover-cyan text-center group"
            >
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full rounded-full border-2 border-primary/30 p-2 glass">
                  <Award className="w-full h-full text-primary" />
                </div>
              </div>

              <h3 className="font-bold mb-2 text-sm group-hover:gradient-text transition-all">
                {cert.title}
              </h3>
              <p className="text-xs text-foreground/60 mb-1">{cert.issuer}</p>
              <p className="text-xs text-foreground/40 mb-4">{cert.date}</p>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-primary/50 hover:glow-cyan text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                View Credential
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
