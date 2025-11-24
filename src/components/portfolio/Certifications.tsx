import { motion } from "framer-motion";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCertifications } from "@/integrations/supabase/hooks";

export const Certifications = () => {
  const { data: certifications, isLoading } = useCertifications();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications?.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-strong p-6 rounded-2xl border border-primary/20 glow-hover-cyan text-center group"
            >
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {cert.image_url ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-primary/30">
                    <img 
                      src={cert.image_url} 
                      alt={cert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-full border-2 border-primary/30 p-2 glass">
                    <Award className="w-full h-full text-primary" />
                  </div>
                )}
              </div>

              <h3 className="font-bold mb-2 text-sm group-hover:gradient-text transition-all">
                {cert.name}
              </h3>
              <p className="text-xs text-foreground/60 mb-1">{cert.issuer}</p>
              <p className="text-xs text-foreground/40 mb-4">{cert.issue_date}</p>

              {cert.credential_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-primary/50 hover:glow-cyan text-xs"
                  asChild
                >
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View Credential
                  </a>
                </Button>
              )}
            </motion.div>
          ))}
          {certifications?.length === 0 && (
            <div className="col-span-full text-center text-foreground/50">
              No certifications to display.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
