import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX, Globe } from "lucide-react";
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

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isBot: true },
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
      // Jarvis-like voice selection strategy for English
      selectedVoice = voices.find(v => 
        (v.name.includes("UK") || v.name.includes("Great Britain") || v.lang.includes("en-GB")) && 
        !v.name.includes("Female")
      ) || voices.find(v => v.lang.includes("en-GB")) || voices.find(v => v.lang.includes("en-US"));
    } else {
      // Find a voice that matches the selected language code
      selectedVoice = voices.find(v => v.lang.startsWith(language));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adjust pitch/rate based on language/persona
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

      // Construct context from all available data
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

      console.log("Sending request to Gemini API...");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${profile.gemini_api_key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
          }]
        })
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok || data.error) {
        const errorMsg = data.error?.message || `API returned status ${response.status}`;
        throw new Error(errorMsg);
      }

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        { text: botResponse, isBot: true },
      ]);

      speak(botResponse);
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = "I'm having trouble connecting right now. Please try again later.";
      
      if (!profile?.gemini_api_key) {
        errorMessage = "My AI brain hasn't been configured yet! Please add a Gemini API key in the Admin Settings.";
      } else if (error.message.includes("API_KEY_INVALID") || error.message.includes("400")) {
        errorMessage = "The API key seems to be invalid. Please check your Gemini API key in Admin Settings.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        { text: errorMessage, isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary glow-cyan flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] md:w-96 z-50"
          >
            <div className="glass-strong rounded-2xl border border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 flex justify-between items-center">
                <div>
                  <h3 className="font-bold gradient-text">AI Assistant</h3>
                  <p className="text-xs text-foreground/50">Always here to help</p>
                </div>
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/20"
                        title="Select Language"
                      >
                        <Globe className="w-4 h-4 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong border-primary/20">
                      {LANGUAGES.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`cursor-pointer ${language === lang.code ? "bg-primary/20" : ""}`}
                        >
                          <span className="mr-2">{lang.native}</span>
                          <span className="text-xs text-foreground/50">({lang.name})</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/20"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
                  >
                    {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-foreground/50" />}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.isBot
                            ? "glass border border-primary/20"
                            : "bg-gradient-to-r from-primary to-secondary"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="glass border border-primary/20 p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-primary/20">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="glass border-primary/30 rounded-xl"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-background z-40"
          >
            {/* Same chat UI but full screen on mobile */}
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold gradient-text">AI Assistant</h3>
                    <p className="text-xs text-foreground/50">Always here to help</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/20"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-primary/20">
                        {LANGUAGES.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`cursor-pointer ${language === lang.code ? "bg-primary/20" : ""}`}
                          >
                            <span className="mr-2">{lang.native}</span>
                            <span className="text-xs text-foreground/50">({lang.name})</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/20"
                      onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    >
                      {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-foreground/50" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.isBot
                            ? "glass border border-primary/20"
                            : "bg-gradient-to-r from-primary to-secondary"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-primary/20">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="glass border-primary/30 rounded-xl"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-xl bg-gradient-to-r from-primary to-secondary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
