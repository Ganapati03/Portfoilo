import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('registration_enabled')
        .limit(1);
      
      if (error) {
        console.error('Error checking registration status:', error);
        return;
      }

      if (!profiles || profiles.length === 0) {
        setRegistrationEnabled(true);
        return;
      }

      setRegistrationEnabled(profiles[0].registration_enabled || false);
    };

    checkRegistrationStatus();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!registrationEnabled) {
          toast.error("Registration is currently disabled.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 mx-auto mb-6">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-portfolio-muted text-sm">
                {isSignUp
                  ? "Sign up to manage your portfolio content"
                  : "Enter your credentials to access the dashboard"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-portfolio-muted group-focus-within:text-accent transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-6 pl-12 pr-4 text-white placeholder:text-portfolio-muted/50 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-portfolio-muted group-focus-within:text-accent transition-colors" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-6 pl-12 pr-4 text-white placeholder:text-portfolio-muted/50 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-white text-black hover:bg-accent rounded-xl py-4 font-bold text-lg mt-8 flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                ) : (
                  <>
                    {isSignUp ? "Sign Up" : "Sign In"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              {registrationEnabled && (
                <div className="text-center mt-6 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-portfolio-muted hover:text-white transition-colors"
                  >
                    {isSignUp
                      ? "Already have an account? Login"
                      : "Need an account? Sign Up"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-portfolio-muted text-sm hover:text-accent transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
