import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/integrations/supabase/hooks";
import { toast } from "sonner";

// Validation helper functions
const validateName = (name: string): { valid: boolean; error?: string } => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your name." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long." };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "Name cannot exceed 60 characters." };
  }
  // Allow letters (including unicode accented letters), spaces, dots, apostrophes, and hyphens
  const nameRegex = /^[a-zA-Z\u00C0-\u024F\s.'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes." };
  }
  return { valid: true };
};

const validateCompany = (company: string): { valid: boolean; error?: string } => {
  const trimmed = company.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your company or organization name." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Company name must be at least 2 characters long." };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: "Company name cannot exceed 80 characters." };
  }
  // Must contain at least one alphanumeric character
  if (!/[a-zA-Z0-9]/.test(trimmed)) {
    return { valid: false, error: "Please enter a valid company name." };
  }
  return { valid: true };
};

const validateContact = (contact: string): { valid: boolean; error?: string; isEmail?: boolean } => {
  const trimmed = contact.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your email or phone number." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Contact info cannot exceed 100 characters." };
  }

  // 1. Check if email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (emailRegex.test(trimmed)) {
    return { valid: true, isEmail: true };
  }

  // 2. Check if phone number (optional leading '+', digits, spaces, parentheses, hyphens, dots)
  const phonePattern = /^(\+?[0-9]{1,4}[\s-]?)?(\(?\d{2,5}\)?[\s-]?)?[\d\s.-]{6,15}$/;
  const digits = trimmed.replace(/\D/g, "");
  if (phonePattern.test(trimmed) && digits.length >= 7 && digits.length <= 15) {
    return { valid: true, isEmail: false };
  }

  return { 
    valid: false, 
    error: "Please enter a valid email (e.g. name@company.com) or phone number (min 7 digits)." 
  };
};

export const WelcomeGate = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("hasVisitedWelcomeGate") !== "true";
  });
  
  const [step, setStep] = useState<"role" | "name" | "company" | "contact" | "confirm" | "done">("role");
  const sendMessage = useSendMessage();
  
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    company: "",
    contact: ""
  });

  const [errors, setErrors] = useState<{ name?: string; company?: string; contact?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already visited, we just emit the close event so audio can try to play
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('welcomeGateClosed'));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    localStorage.setItem("hasVisitedWelcomeGate", "true");
    setIsVisible(false);
    window.dispatchEvent(new Event('welcomeGateClosed'));
  };

  const handleRoleSelection = (role: "recruiter" | "visitor") => {
    setFormData(prev => ({ ...prev, role }));
    if (role === "visitor") {
      setStep("done");
    } else {
      setStep("name");
    }
  };

  const handleNextStep = (currentField: "name" | "company" | "contact", nextStep: "company" | "contact" | "confirm") => {
    let result: { valid: boolean; error?: string };
    
    if (currentField === "name") {
      result = validateName(formData.name);
    } else if (currentField === "company") {
      result = validateCompany(formData.company);
    } else {
      result = validateContact(formData.contact);
    }

    if (!result.valid) {
      setErrors(prev => ({ ...prev, [currentField]: result.error }));
      return;
    }

    // Clear error for this field
    setErrors(prev => ({ ...prev, [currentField]: undefined }));
    // Trim current field value in formData
    setFormData(prev => ({ ...prev, [currentField]: prev[currentField].trim() }));
    setStep(nextStep);
  };

  const submitForm = async () => {
    if (isSubmitting) return; // Prevent double-clicking
    
    if (formData.role === "recruiter") {
      const nameCheck = validateName(formData.name);
      const companyCheck = validateCompany(formData.company);
      const contactCheck = validateContact(formData.contact);

      if (!nameCheck.valid || !companyCheck.valid || !contactCheck.valid) {
        toast.error("Please ensure all fields are filled out correctly.");
        if (!nameCheck.valid) {
          setErrors(prev => ({ ...prev, name: nameCheck.error }));
          setStep("name");
        } else if (!companyCheck.valid) {
          setErrors(prev => ({ ...prev, company: companyCheck.error }));
          setStep("company");
        } else {
          setErrors(prev => ({ ...prev, contact: contactCheck.error }));
          setStep("contact");
        }
        return;
      }

      const cleanName = formData.name.trim();
      const cleanCompany = formData.company.trim();
      const cleanContact = formData.contact.trim();

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
            name: cleanName,
            message: `You have a new recruiter lead!\n\nName: ${cleanName}\nCompany: ${cleanCompany}\nContact Info: ${cleanContact}`
          }),
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }

      // 2. Save to Supabase Database
      sendMessage.mutate({
        name: cleanName,
        email: contactCheck.isEmail ? cleanContact : `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'recruiter'}@lead.portfolio`,
        message: `[Automated Recruiter Lead]\nCompany: ${cleanCompany}\nRole: ${formData.role}\nContact: ${cleanContact}`
      }, {
        onSuccess: () => {
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
        localStorage.setItem("hasVisitedWelcomeGate", "true");
        setIsVisible(false);
        window.dispatchEvent(new Event('welcomeGateClosed'));
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
        {/* Dismiss / Close button */}
        {step !== "done" && (
          <button
            onClick={handleDismiss}
            aria-label="Skip and explore portfolio"
            className="absolute top-4 right-4 text-portfolio-muted hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 z-10"
            title="Skip and explore portfolio"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === "role" && (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-2">Hi, welcome to Ganapati's portfolio 👋</h2>
              <p className="font-body font-normal md:font-medium text-portfolio-muted leading-[1.7] mb-6">Are you a recruiter or just exploring?</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => handleRoleSelection("recruiter")}
                  className="w-full bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 py-6 font-display font-semibold tracking-[0.12em] uppercase text-xs"
                >
                  I'm a Recruiter
                </Button>
                <Button 
                  onClick={() => handleRoleSelection("visitor")}
                  variant="outline"
                  className="w-full border-portfolio-border text-white hover:bg-portfolio-secondary py-6 font-display font-semibold tracking-[0.12em] uppercase text-xs"
                >
                  I'm a Visitor
                </Button>
              </div>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">Great! May I know your name?</h2>
              <div className="mb-4">
                <Input 
                  autoFocus
                  maxLength={60}
                  value={formData.name}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, name: val }));
                    if (errors.name) {
                      const check = validateName(val);
                      if (check.valid) {
                        setErrors(prev => ({ ...prev, name: undefined }));
                      }
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNextStep("name", "company");
                    }
                  }}
                  placeholder="Enter your name (e.g. Alex Smith)"
                  className={`bg-portfolio-bg text-white font-body focus-visible:ring-portfolio-accent transition-colors ${
                    errors.name ? 'border-red-500/80 focus-visible:ring-red-500' : 'border-portfolio-border'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs font-body mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("role")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary font-display font-semibold tracking-[0.12em] uppercase text-xs">Back</Button>
                <Button 
                  onClick={() => handleNextStep("name", "company")} 
                  disabled={!formData.name.trim()}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 font-display font-semibold tracking-[0.12em] uppercase text-xs disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === "company" && (
            <motion.div key="company" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">Which company are you from?</h2>
              <div className="mb-4">
                <Input 
                  autoFocus
                  maxLength={80}
                  value={formData.company}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, company: val }));
                    if (errors.company) {
                      const check = validateCompany(val);
                      if (check.valid) {
                        setErrors(prev => ({ ...prev, company: undefined }));
                      }
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNextStep("company", "contact");
                    }
                  }}
                  placeholder="Company name (e.g. Acme Corp)"
                  className={`bg-portfolio-bg text-white font-body focus-visible:ring-portfolio-accent transition-colors ${
                    errors.company ? 'border-red-500/80 focus-visible:ring-red-500' : 'border-portfolio-border'
                  }`}
                />
                {errors.company && (
                  <p className="text-red-400 text-xs font-body mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.company}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("name")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary font-display font-semibold tracking-[0.12em] uppercase text-xs">Back</Button>
                <Button 
                  onClick={() => handleNextStep("company", "contact")} 
                  disabled={!formData.company.trim()}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 font-display font-semibold tracking-[0.12em] uppercase text-xs disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">Please share your email or phone</h2>
              <div className="mb-4">
                <Input 
                  autoFocus
                  maxLength={100}
                  value={formData.contact}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, contact: val }));
                    if (errors.contact) {
                      const check = validateContact(val);
                      if (check.valid) {
                        setErrors(prev => ({ ...prev, contact: undefined }));
                      }
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNextStep("contact", "confirm");
                    }
                  }}
                  placeholder="alex@company.com or +1 234 567 8900"
                  className={`bg-portfolio-bg text-white font-body focus-visible:ring-portfolio-accent transition-colors ${
                    errors.contact ? 'border-red-500/80 focus-visible:ring-red-500' : 'border-portfolio-border'
                  }`}
                />
                {errors.contact && (
                  <p className="text-red-400 text-xs font-body mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.contact}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("company")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary font-display font-semibold tracking-[0.12em] uppercase text-xs">Back</Button>
                <Button 
                  onClick={() => handleNextStep("contact", "confirm")} 
                  disabled={!formData.contact.trim()}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 font-display font-semibold tracking-[0.12em] uppercase text-xs disabled:opacity-50"
                >
                  Review
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-4">Please confirm your details</h2>
              <div className="bg-portfolio-bg p-4 rounded-xl border border-portfolio-border mb-6">
                <p className="font-display font-medium tracking-[0.1em] text-[10px] uppercase text-portfolio-muted mb-1">Name</p>
                <p className="font-body font-medium text-white mb-3 break-words">{formData.name.trim()}</p>
                
                <p className="font-display font-medium tracking-[0.1em] text-[10px] uppercase text-portfolio-muted mb-1">Company</p>
                <p className="font-body font-medium text-white mb-3 break-words">{formData.company.trim()}</p>
                
                <p className="font-display font-medium tracking-[0.1em] text-[10px] uppercase text-portfolio-muted mb-1">Contact</p>
                <p className="font-body font-medium text-white break-words">{formData.contact.trim()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("contact")} className="border-portfolio-border text-white w-1/3 hover:bg-portfolio-secondary font-display font-semibold tracking-[0.12em] uppercase text-xs">Back</Button>
                <Button 
                  onClick={submitForm} 
                  disabled={isSubmitting}
                  className="w-2/3 bg-portfolio-accent text-portfolio-bg hover:bg-portfolio-accent/90 font-display font-semibold tracking-[0.12em] uppercase text-xs"
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
                    <h2 className="text-2xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-2">Thanks, {formData.name.trim()}!</h2>
                    <p className="font-body font-normal md:font-medium text-portfolio-muted leading-[1.7]">I will make sure Ganapati connects with you soon.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold tracking-[-0.03em] leading-[1.1] text-white mb-2">Welcome!</h2>
                    <p className="font-body font-normal md:font-medium text-portfolio-muted leading-[1.7]">Feel free to explore my projects and skills.</p>
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

