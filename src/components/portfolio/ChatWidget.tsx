import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "lottie-react";
import spookyCatAnimation from "../../../public/spooky-cat.json";
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
    
    let selectedVoice = voices.find(v => 
      (v.name.includes("UK") || v.name.includes("Great Britain") || v.lang.includes("en-GB")) && 
      !v.name.includes("Female")
    ) || voices.find(v => v.lang.includes("en-GB")) || voices.find(v => v.lang.includes("en-US"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = 0.9;
    utterance.rate = 1.05;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm not exactly sure about that. I know about skills, projects, experience, and education. Try asking me about one of those!";
      const query = userMessage.toLowerCase();

      // 1. Greetings
      if (query.match(/^(hi|hello|hey|greetings|sup)/)) {
        botResponse = `Hello! I'm the local AI assistant for ${profile?.full_name || 'this portfolio'}. I can tell you about their skills, projects, experience, or education. What would you like to know?`;
      } 
      // 2. Custom AI Knowledge Matches
      else if (knowledgeBase && knowledgeBase.some(k => query.includes(k.topic.toLowerCase()))) {
        const match = knowledgeBase.find(k => query.includes(k.topic.toLowerCase()));
        botResponse = match?.description || botResponse;
      }
      // 3. Skills
      else if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("know")) {
        botResponse = skills?.length 
          ? `Here are some of the main skills: ${skills.map(s => s.name).slice(0, 8).join(', ')} and more!` 
          : "I don't have any skills listed yet.";
      }
      // 4. Projects
      else if (query.includes("project") || query.includes("portfolio") || query.includes("work") || query.includes("built")) {
        botResponse = projects?.length 
          ? `Some notable projects include: ${projects.map(p => p.title).slice(0, 3).join(', ')}. Check out the portfolio section for details!` 
          : "I don't have any projects listed yet.";
      }
      // 5. Experience
      else if (query.includes("experience") || query.includes("job") || query.includes("role") || query.includes("company")) {
        botResponse = experience?.length 
          ? `Here is recent experience: ${experience.map(e => `${e.position} at ${e.company}`).join('. ')}.` 
          : "I don't have any work experience listed yet.";
      }
      // 6. Education
      else if (query.includes("education") || query.includes("degree") || query.includes("college") || query.includes("university") || query.includes("school")) {
        botResponse = education?.length 
          ? `Education details: ${education.map(e => `${e.degree} from ${e.institution}`).join('. ')}.` 
          : "I don't have any education details listed yet.";
      }
      // 7. Certifications
      else if (query.includes("cert")) {
        botResponse = certifications?.length 
          ? `Certifications include: ${certifications.map(c => c.name).join(', ')}.` 
          : "I don't have any certifications listed yet.";
      }
      
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      speak(botResponse);
      setIsTyping(false);
    }, 600); // Simulate natural typing delay
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={isOpen ? { scale: 1 } : { scale: [1, 1.3, 1] }}
        transition={isOpen ? { duration: 0.2 } : { 
          duration: 1.5, 
          repeat: Infinity, 
          repeatDelay: 4,
          times: [0, 0.15, 1], // sudden pop, slow settle
          ease: ["backOut", "easeInOut"] 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 flex items-center justify-center group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="w-7 h-7 text-black" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} className="relative w-12 h-12 flex items-center justify-center">
              <div className="w-[150%] h-[150%] absolute flex items-center justify-center" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(80%) saturate(2891%) hue-rotate(346deg) brightness(99%) contrast(96%)' }}>
                <Lottie animationData={spookyCatAnimation} loop={true} />
              </div>
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
                  <div className="relative">
                    <div className="w-12 h-12 flex items-center justify-center relative">
                      <div className="w-[150%] h-[150%] absolute flex items-center justify-center" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(80%) saturate(2891%) hue-rotate(346deg) brightness(99%) contrast(96%)' }}>
                        <Lottie animationData={spookyCatAnimation} loop={true} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-none mb-1">AI Assistant</h3>
                    <p className="text-xs text-portfolio-muted font-medium">Online • Local AI Engine</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
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
                    Local Smart Assistant
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
