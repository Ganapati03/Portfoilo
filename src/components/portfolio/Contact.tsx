import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { useProfile, useSendMessage } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

export const Contact = () => {
  const { data: profile } = useProfile();
  const sendMessage = useSendMessage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    sendMessage.mutate(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      },
      onError: (error) => {
        toast.error(`Error sending message: ${error.message}`);
      }
    });
  };

  const FloatingInput = ({ label, id, type = "text", value, onChange, isTextArea = false }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value.length > 0;

    return (
      <div className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-accent to-accent/50 rounded-xl blur opacity-0 transition duration-500 ${isFocused ? 'opacity-30' : 'group-hover:opacity-10'}`} />
        <div className="relative relative bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          <label
            htmlFor={id}
            className={`absolute left-5 transition-all duration-300 pointer-events-none text-portfolio-muted font-body font-medium ${
              isActive ? 'top-2 text-[10px] uppercase tracking-[0.1em] text-accent' : 'top-4 text-sm'
            }`}
          >
            {label}
          </label>
          {isTextArea ? (
            <textarea
              id={id}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={4}
              className="w-full bg-transparent text-white pt-8 pb-3 px-5 focus:outline-none resize-none"
            />
          ) : (
            <input
              id={id}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent text-white pt-8 pb-3 px-5 focus:outline-none"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="contact" className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12 flex flex-col justify-center"
          >
            <div>
              <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-accent mb-4 block">
                Connect
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white mb-6">
                Let's Build<br/>
                Something<br/>
                <span className="text-accent">Together.</span>
              </h2>
              <p className="font-body font-normal md:font-medium text-white/70 leading-[1.7] text-lg max-w-md">
                Have a project in mind or want to explore an opportunity? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-10 border-t border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group hover:border-accent hover:bg-accent/10 transition-colors">
                <Mail className="w-6 h-6 text-white group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="font-display font-medium tracking-[0.1em] text-xs text-portfolio-muted uppercase mb-1">Direct Email</div>
                <a href={`mailto:${profile?.email || "hello@example.com"}`} className="font-display font-semibold tracking-[-0.02em] text-base sm:text-xl md:text-2xl text-white hover:text-accent transition-colors break-all">
                  {profile?.email || "hello@example.com"}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 md:p-12 rounded-[2rem] border border-white/10 space-y-6">
              <h3 className="text-2xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-8">Send a Message</h3>
              
              <div className="space-y-5">
                <FloatingInput
                  id="name"
                  label="Your Name"
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                />
                <FloatingInput
                  id="email"
                  label="Your Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
                <FloatingInput
                  id="message"
                  label="Tell me about your project..."
                  isTextArea
                  value={formData.message}
                  onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-white text-black hover:bg-accent rounded-full py-4 font-display font-semibold tracking-[0.12em] uppercase text-sm mt-6 flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
                disabled={sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
