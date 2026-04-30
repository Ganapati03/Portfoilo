import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/integrations/supabase/hooks";

export const Hero = () => {
  const { data: profile, isLoading } = useProfile();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-bg">
        <Loader2 className="w-8 h-8 animate-spin text-portfolio-accent" />
      </div>
    );
  }

  const nameParts = profile?.full_name ? profile.full_name.split(" ") : ["John", "Doe"];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section id="home" className="min-h-screen relative flex items-center bg-portfolio-bg overflow-hidden pt-20">
      {/* Arc SVG Background */}
      <div className="arc-bg">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <circle cx="100" cy="0" r="50" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="0" r="70" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="0" r="90" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side (60%) */}
          <div className="w-full md:w-[60%] flex flex-col">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="flex flex-col"
            >
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-portfolio-text-sec text-lg tracking-widest uppercase mb-4"
              >
                I'M
              </motion.span>

              <div className="font-display font-black text-6xl md:text-8xl leading-none mb-6">
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-white"
                >
                  {firstName}
                </motion.div>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-portfolio-accent"
                >
                  {lastName}
                </motion.div>
              </div>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-portfolio-text-sec text-base md:text-lg max-w-lg mb-10"
              >
                {profile?.bio || profile?.title || "Full Stack Developer shaping the future of the web with modern UI/UX and scalable architectures."}
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToSection("contact")}
                  className="bg-portfolio-accent text-portfolio-bg px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  Contact +
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side (40%) */}
          <div className="w-full md:w-[40%] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full aspect-[3/4] md:aspect-[3/4] max-w-sm mx-auto"
            >
              <img
                src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
                alt="Profile"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Floating Stat Card 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-20 glass-card p-4 flex flex-col shadow-xl"
              >
                <span className="font-display font-bold text-2xl text-white">10k+</span>
                <span className="text-portfolio-text-sec text-xs uppercase tracking-wider">Completed<br/>project</span>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 bottom-20 glass-card p-4 flex flex-col shadow-xl"
              >
                <span className="font-display font-bold text-2xl text-white">900+</span>
                <span className="text-portfolio-text-sec text-xs uppercase tracking-wider">Client<br/>review</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Bottom Horizontal Rule */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-portfolio-border" />
    </section>
  );
};
