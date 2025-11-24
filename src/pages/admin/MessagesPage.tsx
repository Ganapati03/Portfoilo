import { motion } from "framer-motion";
import { Mail, Trash2, Eye, Loader2 } from "lucide-react";
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
import { useMessages, useMarkMessageRead, useDeleteMessage } from "@/integrations/supabase/hooks";
import { toast } from "sonner";

const MessagesPage = () => {
  const { data: messages, isLoading } = useMessages();
  const markAsRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  const handleViewMessage = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id, {
        onError: (error) => {
          console.error("Error marking message as read:", error);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage.mutate(id, {
        onSuccess: () => {
          toast.success("Message deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting message: ${error.message}`);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        {messages?.map((msg) => (
          <Card 
            key={msg.id} 
            className={`glass-strong p-6 border ${
              msg.read ? "border-primary/10" : "border-primary/30"
            } hover:glow-cyan transition-all`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                msg.read ? "bg-primary/10" : "bg-gradient-to-br from-primary/20 to-secondary/20"
              }`}>
                <Mail className={`w-5 h-5 ${msg.read ? "text-primary/50" : "text-primary"}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold">{msg.name}</h3>
                      {!msg.read && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60">{msg.email}</p>
                    {/* Subject is not in the schema currently, so we omit it or use a placeholder if needed. 
                        Assuming message content is enough. */}
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-foreground/40 mt-2">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-xl border-primary/50 hover:glow-cyan"
                          onClick={() => handleViewMessage(msg.id, msg.read || false)}
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
                            <div className="text-sm text-foreground/50 mb-1">Date</div>
                            <div className="text-sm">{new Date(msg.created_at).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-foreground/50 mb-1">Message</div>
                            <div className="glass p-4 rounded-xl border border-primary/20">
                              {msg.message}
                            </div>
                          </div>
                          <Button 
                            className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
                            onClick={() => window.location.href = `mailto:${msg.email}?subject=Re: Portfolio Inquiry`}
                          >
                            Reply via Email
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {messages?.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
