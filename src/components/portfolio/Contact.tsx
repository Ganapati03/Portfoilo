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

  return (
    <section id="contact" className="py-24 relative bg-portfolio-bg">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 flex flex-col justify-center"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Let's Build<br/>
                Something<br/>
                <span className="text-portfolio-accent">Together.</span>
              </h2>
              <p className="text-portfolio-text-sec text-lg leading-relaxed max-w-md">
                Have a project in mind or want to explore an opportunity? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-portfolio-border">
              <div className="w-14 h-14 rounded-full bg-portfolio-card flex items-center justify-center border border-portfolio-border">
                <Mail className="w-6 h-6 text-portfolio-accent" />
              </div>
              <div>
                <div className="text-sm font-medium text-portfolio-muted uppercase tracking-wider mb-1">Direct Email</div>
                <a href={`mailto:${profile?.email || "hello@example.com"}`} className="text-white font-display text-xl hover:text-portfolio-accent transition-colors">
                  {profile?.email || "hello@example.com"}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-portfolio-card p-8 md:p-10 rounded-[2rem] border border-portfolio-border shadow-2xl space-y-6">
              <h3 className="text-2xl font-display font-bold text-white mb-8">Send a Message</h3>
              
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-portfolio-bg border border-portfolio-border rounded-xl px-5 py-4 text-white focus:outline-none focus:border-portfolio-accent focus:ring-1 focus:ring-portfolio-accent transition-all placeholder:text-portfolio-muted"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-portfolio-bg border border-portfolio-border rounded-xl px-5 py-4 text-white focus:outline-none focus:border-portfolio-accent focus:ring-1 focus:ring-portfolio-accent transition-all placeholder:text-portfolio-muted"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="w-full bg-portfolio-bg border border-portfolio-border rounded-xl px-5 py-4 text-white focus:outline-none focus:border-portfolio-accent focus:ring-1 focus:ring-portfolio-accent transition-all resize-none placeholder:text-portfolio-muted"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-portfolio-accent text-portfolio-bg rounded-full py-4 font-bold text-lg mt-4 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70"
                disabled={sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-5 h-5" />
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
