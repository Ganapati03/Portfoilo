import { motion } from "framer-motion";
import { MonitorSmartphone, Wand2, Database, Zap } from "lucide-react";

const services = [
  {
    icon: MonitorSmartphone,
    title: "Web App Development",
    description: "Building blazing fast, scalable, and secure full-stack applications with React, Next.js, and modern frameworks.",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    icon: Wand2,
    title: "Cinematic UI/UX Design",
    description: "Crafting premium, Apple-inspired interfaces with fluid framer-motion animations and stunning glassmorphism.",
    color: "from-accent/20 to-orange-500/20"
  },
  {
    icon: Database,
    title: "Backend Architecture",
    description: "Designing robust APIs and database structures with Supabase, PostgreSQL, and scalable microservices.",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Auditing and turbocharging existing web apps for perfect Lighthouse scores and instantaneous load times.",
    color: "from-yellow-500/20 to-amber-500/20"
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center max-w-3xl mx-auto"
        >
          <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-accent mb-6 block">
            What I Do
          </span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white mb-8">
            My Services
          </h2>
          <p className="font-body font-normal md:font-medium text-white/70 leading-[1.7] text-lg md:text-xl">
            I deliver end-to-end digital solutions, combining stunning cinematic design with robust, high-performance engineering.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative p-[1px] rounded-[2.5rem] overflow-hidden"
            >
              {/* Glowing Border Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative h-full bg-[#111111] rounded-[2.5rem] p-10 md:p-14 overflow-hidden flex flex-col justify-between backdrop-blur-xl border border-white/5 group-hover:border-transparent transition-colors duration-500">
                
                {/* Background glow for icon */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${service.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-1000`} />

                <div>
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 relative z-10">
                    <service.icon className="w-8 h-8 text-white group-hover:text-accent transition-colors duration-500" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display font-semibold tracking-[-0.02em] text-3xl text-white mb-6 leading-[1.2] relative z-10 group-hover:text-accent transition-colors duration-500">
                    {service.title}
                  </h3>
                  
                  <p className="font-body font-normal md:font-medium leading-[1.7] text-white/70 text-base md:text-lg relative z-10 group-hover:text-white/80 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
