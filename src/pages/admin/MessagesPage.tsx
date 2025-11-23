import { motion } from "framer-motion";
import { Mail, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const messages = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Project Inquiry",
    message: "Hi! I'd love to discuss a potential project collaboration...",
    date: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@startup.com",
    subject: "Job Opportunity",
    message: "We're looking for a senior developer and your portfolio caught our attention...",
    date: "1 day ago",
    isRead: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@agency.com",
    subject: "Freelance Work",
    message: "Would you be interested in a short-term freelance project?",
    date: "3 days ago",
    isRead: true,
  },
];

const MessagesPage = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Messages</h1>
        <p className="text-foreground/60">View and manage contact form submissions</p>
      </motion.div>

      <div className="space-y-4 max-w-5xl">
        {messages.map((msg) => (
          <Card 
            key={msg.id} 
            className={`glass-strong p-6 border ${
              msg.isRead ? "border-primary/10" : "border-primary/30"
            } hover:glow-cyan transition-all`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                msg.isRead ? "bg-primary/10" : "bg-gradient-to-br from-primary/20 to-secondary/20"
              }`}>
                <Mail className={`w-5 h-5 ${msg.isRead ? "text-primary/50" : "text-primary"}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold">{msg.name}</h3>
                      {!msg.isRead && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60">{msg.email}</p>
                    <p className="text-sm font-medium text-foreground/80 mt-2">{msg.subject}</p>
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-foreground/40 mt-2">{msg.date}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-xl border-primary/50 hover:glow-cyan"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-strong border-primary/20 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="gradient-text">Message Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-foreground/50 mb-1">From</div>
                            <div className="font-medium">{msg.name} ({msg.email})</div>
                          </div>
                          <div>
                            <div className="text-sm text-foreground/50 mb-1">Subject</div>
                            <div className="font-medium">{msg.subject}</div>
                          </div>
                          <div>
                            <div className="text-sm text-foreground/50 mb-1">Date</div>
                            <div className="text-sm">{msg.date}</div>
                          </div>
                          <div>
                            <div className="text-sm text-foreground/50 mb-1">Message</div>
                            <div className="glass p-4 rounded-xl border border-primary/20">
                              {msg.message}
                            </div>
                          </div>
                          <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                            Reply via Email
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
