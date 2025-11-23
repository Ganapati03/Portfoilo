import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIKnowledge } from "@/integrations/supabase/hooks";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { data: knowledgeBase } = useAIKnowledge();

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsTyping(true);
    
    // Simple keyword matching logic
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Please contact me directly for more details.";
      
      if (knowledgeBase) {
        const lowerMsg = userMessage.toLowerCase();
        const match = knowledgeBase.find(item => 
          lowerMsg.includes(item.topic.toLowerCase()) || 
          item.topic.toLowerCase().includes(lowerMsg)
        );
        
        if (match) {
          botResponse = match.description;
        } else {
            // Fallback for common greetings if not in DB
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
                botResponse = "Hello! Feel free to ask me about my skills, experience, or projects.";
            }
        }
      }

      setMessages((prev) => [
        ...prev,
        { text: botResponse, isBot: true },
      ]);
      setIsTyping(false);
    }, 1000);
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
              <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <h3 className="font-bold gradient-text">AI Assistant</h3>
                <p className="text-xs text-foreground/50">Always here to help</p>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
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
