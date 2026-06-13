import { motion } from "framer-motion";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { useCertifications } from "@/integrations/supabase/hooks";

export const Certifications = () => {
  const { data: certifications, isLoading } = useCertifications();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section id="certifications" className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-accent text-sm tracking-[0.2em] uppercase font-bold mb-4 block">
            Achievements
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black text-white">
            Certifications
          </h2>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden py-4">
          <style>
            {`
              @keyframes marqueeLeftToRight {
                0% { transform: translateX(-10%); }
                100% { transform: translateX(0%); }
              }
              .animate-marquee-ltr {
                animation: marqueeLeftToRight 10s linear infinite;
              }
            `}
          </style>
          {/* Gradient Edges for smooth entry/exit */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
          
          <div className="flex w-max animate-marquee-ltr hover:[animation-play-state:paused]">
            {/* Create 10 identical blocks to ensure the screen is filled even if there are only 1 or 2 certifications. 
                Animating 10% exactly translates 1 block. */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((blockIdx) => (
              <div key={blockIdx} className="flex gap-8 pr-8 shrink-0">
                {certifications?.map((cert, index) => (
                  <div
                    key={`${cert.id}-${blockIdx}-${index}`}
                    className="group relative h-[220px] w-[320px] sm:h-[260px] sm:w-[380px] md:h-[300px] md:w-[450px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 bg-secondary/20 cursor-pointer"
                  >
                    {/* Background Image filling the card */}
                    {cert.image_url ? (
                      <img 
                        src={cert.image_url} 
                        alt={cert.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-secondary/50 flex flex-col items-center justify-center gap-4 transition-transform duration-700 group-hover:scale-110">
                        <Award className="w-16 h-16 text-portfolio-muted transition-colors duration-500 group-hover:text-accent" />
                        <span className="text-portfolio-muted font-medium text-sm px-4 text-center">No Image Provided</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay Background */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                            {cert.name}
                          </h3>
                          <p className="text-accent font-medium mb-1 tracking-wide">{cert.issuer}</p>
                          <p className="text-gray-300 text-sm">{cert.issue_date}</p>
                        </div>

                        {cert.credential_url && (
                          <div className="w-full pt-4 mt-auto">
                            <a 
                              href={cert.credential_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-black bg-accent hover:bg-white px-6 py-3 rounded-full transition-all duration-300 w-full"
                            >
                              View Credential
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {certifications?.length === 0 && (
              <div className="col-span-full text-portfolio-muted text-lg py-12 text-center w-full">
                No certifications to display.
              </div>
            )}
          </div>
        </div>
    </section>
  );
};
