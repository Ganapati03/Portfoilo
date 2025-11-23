import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6">Let's work together</h3>
            <p className="text-foreground/70 mb-8">
              Have a project in mind? Let's discuss how I can help bring your ideas to life.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 glass p-4 rounded-xl border border-primary/20">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-foreground/50">Email</div>
                  <div className="font-medium">john.doe@example.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4 glass p-4 rounded-xl border border-secondary/20">
                <div className="p-3 rounded-lg bg-secondary/20">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-foreground/50">Phone</div>
                  <div className="font-medium">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-center gap-4 glass p-4 rounded-xl border border-primary/20">
                <div className="p-3 rounded-lg bg-primary/20">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-foreground/50">Location</div>
                  <div className="font-medium">San Francisco, CA</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="glass-strong p-6 rounded-2xl border border-primary/20 space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  className="glass border-primary/30 rounded-xl"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="glass border-primary/30 rounded-xl"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  className="glass border-primary/30 rounded-xl resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              >
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
