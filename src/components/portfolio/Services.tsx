import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MonitorSmartphone, Wand2, Database, Zap } from "lucide-react";
import { MzaCarousel } from "./mzaCarousel";
import "./mzaCarousel.css"; 

const services = [
  {
    icon: MonitorSmartphone,
    title: "Web App Development",
    description: "Building blazing fast, scalable, and secure full-stack applications with React, Next.js, and modern frameworks.",
    bgId: 1015,
  },
  {
    icon: Wand2,
    title: "Cinematic UI/UX",
    description: "Crafting premium, Apple-inspired interfaces with fluid framer-motion animations and stunning glassmorphism.",
    bgId: 1011,
  },
  {
    icon: Database,
    title: "Backend Architecture",
    description: "Designing robust APIs and database structures with Supabase, PostgreSQL, and scalable microservices.",
    bgId: 1018,
  },
  {
    icon: Zap,
    title: "Performance Boost",
    description: "Auditing and turbocharging existing web apps for perfect Lighthouse scores and instantaneous load times.",
    bgId: 1021,
  }
];

export const Services = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

    // Initialize the vanilla JS carousel provided by the user
    const carousel = new MzaCarousel(carouselRef.current, {
      transitionMs: 900
    });

    return () => {
      // Cleanup the animation loop and observers
      if (carousel.destroy) carousel.destroy();
    };
  }, []);

  return (
    <section id="services" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff6b35]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-[100vw] relative z-10 px-0">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20 text-center max-w-3xl mx-auto px-4"
        >
          <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-[#ff6b35] mb-6 block">
            What I Do
          </span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white mb-8">
            My Services
          </h2>
          <p className="font-body font-normal md:font-medium text-white/70 leading-[1.7] text-lg md:text-xl">
            I deliver end-to-end digital solutions, combining stunning cinematic design with robust engineering.
          </p>
        </motion.div>

        {/* The Carousel */}
        <div className="mzaCarousel" ref={carouselRef} aria-roledescription="carousel" aria-label="Featured services">
          <div className="mzaCarousel-viewport" tabIndex={0}>
            <div className="mzaCarousel-track">
              
              {services.map((service, index) => (
                <article key={index} className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${services.length}`}>
                  <div className="mzaCard p-6 md:p-8 flex flex-col justify-between" style={{ "--mzaCard-bg": `url('https://picsum.photos/id/${service.bgId}/1600/1000')` } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1 flex flex-col gap-2">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-md mb-2">
                        <service.icon className="w-6 h-6 text-[#ff6b35]" />
                      </div>
                      <h2 className="mzaCard-title">{service.title}</h2>
                      <p className="mzaCard-kicker">Expertise & Delivery</p>
                    </header>
                    <div className="mt-auto flex flex-col gap-4 relative z-10">
                      <p className="mzaCard-text mzaPar-2">{service.description}</p>
                      <footer className="mzaCard-actions mzaPar-3">
                        <button className="mzaBtn w-full sm:w-auto">Explore Service</button>
                      </footer>
                    </div>
                  </div>
                </article>
              ))}

            </div>
          </div>

          <div className="mzaCarousel-controls" aria-label="Controls">
            <button className="mzaCarousel-prev" aria-label="Previous slide" type="button">‹</button>
            <button className="mzaCarousel-next" aria-label="Next slide" type="button">›</button>
          </div>

          <div className="mzaCarousel-pagination" role="tablist" aria-label="Slide navigation"></div>
          <div className="mzaCarousel-progress" aria-hidden="true"><span className="mzaCarousel-progressBar"></span></div>
        </div>
      </div>
    </section>
  );
};
