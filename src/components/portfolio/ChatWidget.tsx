import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  useAIKnowledge, 
  useProfile, 
  useProjects, 
  useSkills, 
  useExperience, 
  useEducation, 
  useCertifications 
} from "@/integrations/supabase/hooks";

type Message = {
  text: string;
  isBot: boolean;
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm an AI assistant. How can I help you learn more about my creator?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState("en");

  const LANGUAGES = [
    { code: "en", name: "English", native: "English" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
    { code: "de", name: "German", native: "Deutsch" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "zh", name: "Chinese", native: "中文" },
    { code: "ja", name: "Japanese", native: "日本語" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  ];
  
  const { data: knowledgeBase } = useAIKnowledge();
  const { data: profile } = useProfile();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();
  const { data: certifications } = useCertifications();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    let selectedVoice = null;

    if (language === 'en') {
      selectedVoice = voices.find(v => 
        (v.name.includes("UK") || v.name.includes("Great Britain") || v.lang.includes("en-GB")) && 
        !v.name.includes("Female")
      ) || voices.find(v => v.lang.includes("en-GB")) || voices.find(v => v.lang.includes("en-US"));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith(language));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    if (language === 'en') {
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 1;
      utterance.rate = 1;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    try {
      if (!profile?.gemini_api_key) {
        throw new Error("Gemini API key not configured");
      }

      const knowledgeContext = knowledgeBase?.map(k => `${k.topic}: ${k.description}`).join("\n") || "";
      const projectsContext = projects?.length 
        ? "\nProjects:\n" + projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags?.join(', ')})`).join("\n") 
        : "";
      const skillsContext = skills?.length 
        ? "\nSkills:\n" + skills.map(s => `- ${s.name} (${s.category})`).join("\n") 
        : "";
      const experienceContext = experience?.length 
        ? "\nExperience:\n" + experience.map(e => `- ${e.position} at ${e.company} (${e.start_date} - ${e.current ? 'Present' : e.end_date})`).join("\n") 
        : "";
      const educationContext = education?.length
        ? "\nEducation:\n" + education.map(e => `- ${e.degree} in ${e.field_of_study} at ${e.institution}`).join("\n")
        : "";
      const certificationsContext = certifications?.length
        ? "\nCertifications:\n" + certifications.map(c => `- ${c.name} from ${c.issuer}`).join("\n")
        : "";

      const systemPrompt = `You are an AI assistant for ${profile.full_name}'s portfolio. 
      Here is the comprehensive data about ${profile.full_name}:
      ${knowledgeContext}
      ${projectsContext}
      ${skillsContext}
      ${experienceContext}
      ${educationContext}
      ${certificationsContext}
      IMPORTANT: You must answer in ${LANGUAGES.find(l => l.code === language)?.name || 'English'}.
      Answer the user's question based on this context. If the answer isn't in the context, politely say you don't know but suggest contacting ${profile.full_name} directly.
      Keep answers concise, professional, and engaging. Do not output markdown symbols like ** or # in your response as it will be spoken aloud.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${profile.gemini_api_key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] }]
        })
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `API returned status ${response.status}`);
      }

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      speak(botResponse);
    } catch (error: any) {
      let errorMessage = "I'm having trouble connecting right now. Please try again later.";
      if (!profile?.gemini_api_key) {
        errorMessage = "My AI brain hasn't been configured yet! Please add a Gemini API key in the Admin Settings.";
      } else if (error.message.includes("API_KEY_INVALID") || error.message.includes("400")) {
        errorMessage = "The API key seems to be invalid. Please check your Gemini API key in Admin Settings.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      setMessages((prev) => [...prev, { text: errorMessage, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-accent/90 backdrop-blur-md flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,107,53,0.3)] border border-white/20 transition-all hover:shadow-[0_0_40px_rgba(255,107,53,0.5)] group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="w-7 h-7 text-black" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} className="relative">
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
              <MessageCircle className="w-7 h-7 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 md:inset-auto md:bottom-28 md:right-6 md:w-[400px] z-50 flex flex-col"
          >
            <div className="flex-1 md:flex-none glass-card bg-black/60 backdrop-blur-xl border border-white/10 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full md:h-[600px] max-h-screen">
              
              {/* Header */}
              <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 relative">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-none mb-1">AI Assistant</h3>
                    <p className="text-xs text-portfolio-muted font-medium">Online • Powered by Gemini</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/10" title="Select Language">
                        <Globe className="w-4 h-4 text-portfolio-muted" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border border-white/10 text-white rounded-xl">
                      {LANGUAGES.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`cursor-pointer focus:bg-white/10 rounded-lg ${language === lang.code ? "bg-white/10 text-accent" : ""}`}
                        >
                          <span className="mr-2">{lang.native}</span>
                          <span className="text-xs text-white/50">({lang.name})</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-white/10"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
                  >
                    {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4 text-portfolio-muted" />}
                  </Button>

                  <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-full hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5 text-portfolio-muted" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-5">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl md:rounded-3xl shadow-sm text-sm md:text-base leading-relaxed ${
                          message.isBot
                            ? "bg-white/10 text-white rounded-tl-sm border border-white/5"
                            : "bg-accent text-black font-medium rounded-tr-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1.5 items-center h-4">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: ["0%", "-50%", "0%"] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              className="w-1.5 h-1.5 rounded-full bg-portfolio-muted"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/40">
                <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 focus-within:border-accent/50 transition-colors">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-white px-3 py-3 max-h-32 min-h-[44px] resize-none focus:outline-none placeholder:text-portfolio-muted text-sm md:text-base"
                    rows={1}
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-xl bg-accent text-black hover:bg-white w-10 h-10 shrink-0 transition-colors mb-0.5 mr-0.5"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <span className="text-[10px] uppercase tracking-widest text-portfolio-muted font-bold">
                    Powered by Google Gemini
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
