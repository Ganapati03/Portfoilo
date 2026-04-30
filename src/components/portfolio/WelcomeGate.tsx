import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/integrations/supabase/hooks";
import { toast } from "sonner";

export const WelcomeGate = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState<"role" | "name" | "company" | "contact" | "confirm" | "done">("role");
  const sendMessage = useSendMessage();
  
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    company: "",
    contact: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = (role: "recruiter" | "visitor") => {
    setFormData(prev => ({ ...prev, role }));
    if (role === "visitor") {
      setStep("done");
    } else {
      setStep("name");
    }
  };

  const handleNext = (nextStep: any) => {
    setStep(nextStep);
  };

  const submitForm = async () => {
    if (isSubmitting) return; // Prevent double-clicking
    
    if (formData.role === "recruiter") {
      setIsSubmitting(true);
      
      // 1. Send Email via Web3Forms
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "ffcde521-a5c1-4e9c-9de1-c28772798826",
            subject: "New Portfolio Lead!",
            from_name: "Portfolio Assistant",
            name: formData.name,
            // We omit the "email" field in the root payload because if the user enters a phone number, Web3Forms blocks it.
            // All details are safely in the message body.
            message: `You have a new recruiter lead!\n\nName: ${formData.name}\nCompany: ${formData.company}\nContact Info: ${formData.contact}`
          }),
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }

      // 2. Save to Supabase Database
      sendMessage.mutate({
        name: formData.name,
        // We ensure Supabase receives something for email, even if it's a phone number. 
        email: formData.contact || "No contact provided",
        message: `[Automated Lead]\nCompany: ${formData.company}\nRole: ${formData.role}\nContact: ${formData.contact}`
      }, {
        onSuccess: () => {
          console.log("Recruiter lead saved successfully");
          setIsSubmitting(false);
          setStep("done");
        },
        onError: () => {
          toast.error("There was an issue saving your details, but welcome anyway!");
          setIsSubmitting(false);
          setStep("done");
        }
      });
    } else {
      setStep("done");
    }
  };

  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, formData.role === "visitor" ? 1500 : 2500);
      return () => clearTimeout(timer);
    }
  }, [step, formData.role]);

  // If they have completed the flow, don't render the blocker
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center backdrop-blur-md bg-portfolio-bg/95 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-portfolio-card border border-portfolio-border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === "role" && (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold font-display text-white mb-2">Hi, welcome to Ganapati's portfolio 👋</h2>
              <p className="text-portfolio-muted mb-6">Are you a recruiter or just exploring?</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => handleRoleSelection("recruiter")}
                  className="w-full bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 py-6 text-base"
                >
                  I'm a Recruiter
                </Button>
                <Button 
                  onClick={() => handleRoleSelection("visitor")}
                  variant="outline"
                  className="w-full border-portfolio-border text-white hover:bg-portfolio-secondary py-6 text-base"
                >
                  I'm a Visitor
                </Button>
              </div>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-4">Great! May I know your name?</h2>
              <Input 
                autoFocus
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && formData.name && handleNext("company")}
                placeholder="Enter your name"
                className="bg-portfolio-bg border-portfolio-border mb-4 text-white focus-visible:ring-portfolio-accent"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("role")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary">Back</Button>
                <Button 
                  onClick={() => handleNext("company")} 
                  disabled={!formData.name}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === "company" && (
            <motion.div key="company" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-4">Which company are you from?</h2>
              <Input 
                autoFocus
                value={formData.company}
                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && formData.company && handleNext("contact")}
                placeholder="Company name"
                className="bg-portfolio-bg border-portfolio-border mb-4 text-white focus-visible:ring-portfolio-accent"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("name")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary">Back</Button>
                <Button 
                  onClick={() => handleNext("contact")} 
                  disabled={!formData.company}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-4">Please share your email or phone</h2>
              <Input 
                autoFocus
                value={formData.contact}
                onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && formData.contact && handleNext("confirm")}
                placeholder="Email or phone number"
                className="bg-portfolio-bg border-portfolio-border mb-4 text-white focus-visible:ring-portfolio-accent"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("company")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary">Back</Button>
                <Button 
                  onClick={() => handleNext("confirm")} 
                  disabled={!formData.contact}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90"
                >
                  Review
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-4">Please confirm your details</h2>
              <div className="bg-portfolio-bg p-4 rounded-xl border border-portfolio-border mb-6">
                <p className="text-sm text-portfolio-muted mb-1">Name</p>
                <p className="text-white mb-3 font-medium">{formData.name}</p>
                
                <p className="text-sm text-portfolio-muted mb-1">Company</p>
                <p className="text-white mb-3 font-medium">{formData.company}</p>
                
                <p className="text-sm text-portfolio-muted mb-1">Contact</p>
                <p className="text-white font-medium">{formData.contact}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("name")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary">Edit</Button>
                <Button 
                  onClick={submitForm} 
                  disabled={isSubmitting}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90"
                >
                  {isSubmitting ? "Sending..." : "Confirm"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-portfolio-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-portfolio-accent/20">
                  <span className="text-2xl">{formData.role === "recruiter" ? "🤝" : "🚀"}</span>
                </div>
                {formData.role === "recruiter" ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Thanks, {formData.name}!</h2>
                    <p className="text-portfolio-muted">I will make sure Ganapati connects with you soon.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
                    <p className="text-portfolio-muted">Feel free to explore my projects and skills.</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
