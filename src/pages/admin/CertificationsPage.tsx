import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCertifications, useAddCertification, useUpdateCertification, useDeleteCertification, useUploadImage } from "@/integrations/supabase/hooks";
import { useState } from "react";
import { toast } from "sonner";

const CertificationsPage = () => {
  const { data: certifications, isLoading } = useCertifications();
  const addCertification = useAddCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();
  const uploadImage = useUploadImage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    image_url: "",
  });

  const resetForm = () => {
    setNewCert({
      name: "",
      issuer: "",
      issue_date: "",
      credential_url: "",
      image_url: "",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadImage.mutateAsync({ file, bucket: "portfolio" });
      setNewCert({ ...newCert, image_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCertification = () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error("Name and Issuer are required");
      return;
    }

    const certData = {
      ...newCert,
      issue_date: newCert.issue_date || null,
    };

    if (editingId) {
      updateCertification.mutate({
        id: editingId,
        ...certData
      }, {
        onSuccess: () => {
          toast.success("Certification updated successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error updating certification: ${error.message}`);
        }
      });
    } else {
      addCertification.mutate(certData, {
        onSuccess: () => {
          toast.success("Certification added successfully");
          resetForm();
        },
        onError: (error) => {
          toast.error(`Error adding certification: ${error.message}`);
        }
      });
    }
  };

  const handleEditCertification = (cert: any) => {
    setNewCert({
      name: cert.name,
      issuer: cert.issuer,
      issue_date: cert.issue_date || "",
      credential_url: cert.credential_url || "",
      image_url: cert.image_url || "",
    });
    setEditingId(cert.id);
    setIsDialogOpen(true);
  };

  const handleDeleteCertification = (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      deleteCertification.mutate(id, {
        onSuccess: () => {
          toast.success("Certification deleted successfully");
        },
        onError: (error) => {
          toast.error(`Error deleting certification: ${error.message}`);
        }
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
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
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Certifications</h1>
          <p className="text-foreground/60">Manage your certifications and credentials</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              onClick={() => {
                setEditingId(null);
                setNewCert({
                  name: "",
                  issuer: "",
                  issue_date: "",
                  credential_url: "",
                  image_url: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">{editingId ? "Edit Certification" : "Add New Certification"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Certification Name</Label>
                <Input 
                  placeholder="e.g., AWS Certified Solutions Architect" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input 
                  placeholder="e.g., Amazon Web Services" 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input 
                  type="date"
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newCert.issue_date}
                  onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Certificate Image</Label>
                <div className="flex items-center gap-4 mt-1">
                  {newCert.image_url && (
                    <img 
                      src={newCert.image_url} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-md object-cover border border-primary/20"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="glass border-primary/30 cursor-pointer"
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      {uploading ? "Uploading..." : "Upload certificate image"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Credential URL</Label>
                <Input 
                  placeholder="https://..." 
                  className="glass border-primary/30 rounded-xl mt-1" 
                  value={newCert.credential_url}
                  onChange={(e) => setNewCert({ ...newCert, credential_url: e.target.value })}
                />
              </div>
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
                onClick={handleSaveCertification}
                disabled={addCertification.isPending || updateCertification.isPending || uploading}
              >
                {(addCertification.isPending || updateCertification.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Certification" : "Add Certification"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications?.map((cert) => (
          <Card key={cert.id} className="glass-strong p-6 border border-primary/20 hover:glow-cyan transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1 line-clamp-2">{cert.name}</h3>
                <p className="text-sm text-foreground/60">{cert.issuer}</p>
                <p className="text-xs text-foreground/40 mt-1">{cert.issue_date}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 rounded-xl border-primary/50 hover:glow-cyan"
                onClick={() => handleEditCertification(cert)}
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                onClick={() => handleDeleteCertification(cert.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
        {certifications?.length === 0 && (
          <div className="col-span-full text-center py-12 text-foreground/50">
            No certifications found. Add your credentials!
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;
