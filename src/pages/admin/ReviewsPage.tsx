import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  Eye,
  Award
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  useAllReviews, 
  useSubmitReview, 
  useUpdateReview, 
  useDeleteReview,
  Review 
} from "@/integrations/supabase/useReviews";
import { toast } from "sonner";

export const ReviewsPage = () => {
  const { data: reviews = [], isLoading } = useAllReviews();
  const submitReview = useSubmitReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    company: "",
    project_name: "",
    rating: 5,
    review: "",
    email: "",
    featured: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.review.trim()) {
      toast.error("Please enter a name and review text.");
      return;
    }

    try {
      await submitReview.mutateAsync({
        name: newReview.name.trim(),
        role: newReview.role.trim() || "Freelance Client",
        company: newReview.company.trim() || "Upwork / Direct",
        project_name: newReview.project_name.trim() || "Web Project",
        rating: newReview.rating,
        review: newReview.review.trim(),
        email: newReview.email.trim(),
        approved: true,
        featured: newReview.featured,
      });

      toast.success("Review added successfully!");
      setIsDialogOpen(false);
      setNewReview({
        name: "",
        role: "",
        company: "",
        project_name: "",
        rating: 5,
        review: "",
        email: "",
        featured: false,
      });
    } catch {
      toast.error("Error adding review.");
    }
  };

  const handleToggleApproved = async (review: Review) => {
    try {
      await updateReview.mutateAsync({
        id: review.id,
        approved: !review.approved,
      });
      toast.success(review.approved ? "Review hidden from public" : "Review approved for public");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    try {
      await updateReview.mutateAsync({
        id: review.id,
        featured: !review.featured,
      });
      toast.success(review.featured ? "Unmarked as featured" : "Marked as featured review");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview.mutateAsync(id);
        toast.success("Review deleted.");
      } catch {
        toast.error("Failed to delete review.");
      }
    }
  };

  // Metrics
  const total = reviews.length;
  const avg = total > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / total).toFixed(1) : "0.0";
  const approvedCount = reviews.filter(r => r.approved).length;
  const featuredCount = reviews.filter(r => r.featured).length;

  const filtered = reviews.filter((r) => {
    const matchRating = filterRating === null || r.rating === filterRating;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query ||
      r.name.toLowerCase().includes(query) ||
      (r.company && r.company.toLowerCase().includes(query)) ||
      (r.project_name && r.project_name.toLowerCase().includes(query)) ||
      r.review.toLowerCase().includes(query);
    return matchRating && matchQuery;
  });

  return (
    <div className="space-y-8 text-white pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-display tracking-tight uppercase">
            Reviews & Ratings
          </h2>
          <p className="text-white/50 mt-1 font-medium tracking-wide">
            Manage feedback from clients, freelancers, and project collaborators
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-black hover:bg-accent/90 rounded-xl font-display font-bold tracking-wider uppercase text-xs flex items-center gap-2 py-6 px-6 shadow-lg shadow-accent/20">
              <Plus className="w-4 h-4" />
              Add Review Manually
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border border-white/10 max-w-lg text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold uppercase text-white tracking-wider">
                Add Client or Freelancer Review
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <Star 
                        className={`w-7 h-7 ${star <= newReview.rating ? "fill-accent text-accent" : "text-white/20"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                  Reviewer Name *
                </label>
                <Input 
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Role / Title
                  </label>
                  <Input 
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    placeholder="e.g. Founder / Senior Dev"
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Platform / Company
                  </label>
                  <Input 
                    value={newReview.company}
                    onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                    placeholder="e.g. Upwork Client"
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                  Project Title
                </label>
                <Input 
                  value={newReview.project_name}
                  onChange={(e) => setNewReview({ ...newReview, project_name: e.target.value })}
                  placeholder="e.g. Full-Stack Web App"
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                  Review Text *
                </label>
                <Textarea 
                  rows={4}
                  value={newReview.review}
                  onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                  placeholder="Write the testimonial or client feedback..."
                  className="bg-black/40 border-white/10 text-white resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="featured"
                  checked={newReview.featured}
                  onChange={(e) => setNewReview({ ...newReview, featured: e.target.checked })}
                  className="rounded border-white/20 accent-accent"
                />
                <label htmlFor="featured" className="text-xs font-medium text-white/80 cursor-pointer">
                  Feature this review prominently
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitReview.isPending}
                  className="bg-accent text-black hover:bg-accent/90 font-bold"
                >
                  Save Review
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60">
              Average Rating
            </CardTitle>
            <Star className="w-5 h-5 text-accent fill-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-black text-white">{avg} ★</div>
            <p className="text-xs text-white/40 mt-1 font-semibold uppercase">Overall rating score</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60">
              Total Reviews
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-black text-white">{total}</div>
            <p className="text-xs text-white/40 mt-1 font-semibold uppercase">Submitted ratings</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60">
              Publicly Visible
            </CardTitle>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-black text-white">{approvedCount}</div>
            <p className="text-xs text-white/40 mt-1 font-semibold uppercase">Approved testimonials</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60">
              Featured Reviews
            </CardTitle>
            <Award className="w-5 h-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-black text-white">{featuredCount}</div>
            <p className="text-xs text-white/40 mt-1 font-semibold uppercase">Top highlighted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by name, project, or text..."
            className="bg-black/40 border-white/10 pl-9 text-xs text-white placeholder:text-white/40 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              filterRating === null ? "bg-accent text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                filterRating === star ? "bg-accent text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / Grid */}
      <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-accent mx-auto" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-widest text-white/50">
                    <th className="py-4 px-6">Rating & Author</th>
                    <th className="py-4 px-6">Role & Platform</th>
                    <th className="py-4 px-6">Project</th>
                    <th className="py-4 px-6">Review Excerpt</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${s <= item.rating ? "fill-accent text-accent" : "text-white/10"}`} 
                            />
                          ))}
                          <span className="text-xs font-bold text-accent ml-1">{item.rating}★</span>
                        </div>
                        <div className="font-display font-bold text-white text-sm">{item.name}</div>
                        {item.email && <div className="text-[11px] text-white/40 font-mono">{item.email}</div>}
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-white/80 font-medium text-xs">{item.role || "Freelancer"}</div>
                        <div className="text-accent text-[11px] font-bold uppercase tracking-wider">{item.company || "Independent"}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-xs text-white/70 font-mono max-w-[140px] truncate block">
                          {item.project_name || "General"}
                        </span>
                      </td>

                      <td className="py-4 px-6 max-w-sm">
                        <p className="text-xs text-white/80 line-clamp-2 italic">
                          "{item.review}"
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => handleToggleApproved(item)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit flex items-center gap-1 ${
                              item.approved 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                : "bg-white/10 text-white/50 border border-white/10"
                            }`}
                          >
                            {item.approved ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {item.approved ? "Approved" : "Hidden"}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(item)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit flex items-center gap-1 ${
                              item.featured 
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                                : "bg-transparent text-white/30 hover:text-white/60"
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {item.featured ? "Featured" : "Standard"}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="font-bold text-white/60 uppercase tracking-widest text-sm">No reviews found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPage;
