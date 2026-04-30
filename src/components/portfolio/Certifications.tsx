import { motion } from "framer-motion";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { useCertifications } from "@/integrations/supabase/hooks";

export const Certifications = () => {
  const { data: certifications, isLoading } = useCertifications();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  return (
    <section id="certifications" className="py-24 bg-portfolio-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Certifications
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certifications?.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex flex-col items-center text-center group border border-portfolio-border hover:border-portfolio-border-accent transition-all"
            >
              <div className="relative w-24 h-24 mb-6 shrink-0">
                {cert.image_url ? (
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-portfolio-border bg-portfolio-secondary">
                    <img 
                      src={cert.image_url} 
                      alt={cert.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl border border-portfolio-border bg-portfolio-secondary flex items-center justify-center transition-colors group-hover:border-portfolio-border-accent group-hover:bg-portfolio-accent/5">
                    <Award className="w-10 h-10 text-portfolio-muted group-hover:text-portfolio-accent transition-colors" />
                  </div>
                )}
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-portfolio-accent transition-colors">
                {cert.name}
              </h3>
              <p className="text-portfolio-text-sec text-sm mb-1">{cert.issuer}</p>
              <p className="text-portfolio-muted text-xs mb-6">{cert.issue_date}</p>

              {cert.credential_url && (
                <div className="mt-auto w-full pt-4 border-t border-portfolio-border">
                  <a 
                    href={cert.credential_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm font-bold text-portfolio-text-sec group-hover:text-white transition-colors"
                  >
                    View Credential
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
          {certifications?.length === 0 && (
            <div className="col-span-full text-portfolio-muted text-lg py-12">
              No certifications to display.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
