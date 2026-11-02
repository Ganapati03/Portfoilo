import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  ShieldCheck, 
  Search,
  Filter
} from "lucide-react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviews, useSubmitReview } from "@/integrations/supabase/useReviews";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";

const ratingLabels: Record<number, string> = {
  1: "Needs Improvement",
  2: "Fair Collaboration",
  3: "Good & Reliable",
  4: "Great Experience",
  5: "Exceptional ⭐ 100% Recommended",
};

export const RateWork = () => {
  // Track page analytics
  useAnalytics("/rate", "Rate My Work");

  const { data: reviews = [], isLoading } = useReviews();
  const submitReview = useSubmitReview();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    project_name: "",
    rating: 5,
    review: "",
    email: "",
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters).";
    }
    if (!formData.review.trim() || formData.review.trim().length < 10) {
      newErrors.review = "Please provide detailed feedback (at least 10 characters).";
    }
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5 stars.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in the required fields correctly.");
      return;
    }

    try {
      await submitReview.mutateAsync({
        name: formData.name.trim(),
        role: formData.role.trim() || "Freelancer / Collaborator",
        company: formData.company.trim() || "Independent",
        project_name: formData.project_name.trim() || "Freelance Web Project",
        rating: formData.rating,
        review: formData.review.trim(),
        email: formData.email.trim(),
        approved: true,
      });

      setSubmitted(true);
      toast.success("Thank you! Your rating and review have been recorded.");
      setFormData({
        name: "",
        role: "",
        company: "",
        project_name: "",
        rating: 5,
        review: "",
        email: "",
      });
    } catch {
      toast.error("There was an issue submitting your review. Please try again.");
    }
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === stars).length / totalReviews) * 100 : 0,
  }));

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = selectedFilter === null || r.rating === selectedFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      r.name.toLowerCase().includes(query) ||
      (r.company && r.company.toLowerCase().includes(query)) ||
      (r.project_name && r.project_name.toLowerCase().includes(query)) ||
      r.review.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-black">
      <Navbar />

      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent font-display text-xs font-semibold tracking-widest uppercase mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Verified Client & Freelancer Feedback
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white uppercase mb-4"
            >
              Rate My <span className="text-accent">Work.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body text-portfolio-muted text-base sm:text-lg leading-relaxed"
            >
              Have we collaborated on a freelance contract, web development project, or technical integration? 
              Share your honest feedback and rating below.
            </motion.p>
          </div>

          {/* Rating Summary Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl backdrop-blur-xl grid md:grid-cols-3 gap-8 items-center"
          >
            {/* Average Score */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <span className="text-6xl font-display font-black text-white tracking-tight">{avgRating}</span>
              <div className="flex gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? "fill-accent text-accent" : "text-white/20"}`} 
                  />
                ))}
              </div>
              <span className="text-portfolio-muted text-xs font-semibold uppercase tracking-wider">
                Based on {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              {ratingCounts.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-white/70 w-8">{item.stars} ★</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-white/50 w-6 text-right font-mono">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Quick Highlights */}
            <div className="flex flex-col gap-4 text-center sm:text-left justify-center pl-0 md:pl-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">100% Client Satisfaction</div>
                  <div className="text-portfolio-muted text-xs">Consistent 5-star communication & delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">Verified Freelance Work</div>
                  <div className="text-portfolio-muted text-xs">From Upwork, Fiverr, and direct contracts</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form & Reviews Section */}
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left: Review Submission Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 glass-card border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight mb-2">
                  Leave a Review
                </h2>
                <p className="font-body text-portfolio-muted text-sm mb-6">
                  Share your experience working together on code quality, speed, and communication.
                </p>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-4 my-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">Review Submitted!</h3>
                    <p className="text-portfolio-muted text-xs leading-relaxed">
                      Thank you for your valuable endorsement. Your review is now visible to other clients and collaborators.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 text-xs uppercase tracking-wider font-semibold"
                    >
                      Submit Another Review
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                        Rating <span className="text-accent">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating !== null ? hoverRating : formData.rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star 
                                className={`w-8 h-8 transition-colors ${
                                  active 
                                    ? "fill-accent text-accent drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" 
                                    : "text-white/20 hover:text-white/50"
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs font-semibold text-accent mt-1.5 font-display">
                        {ratingLabels[hoverRating !== null ? hoverRating : formData.rating]}
                      </p>
                      {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Your Name <span className="text-accent">*</span>
                      </label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className={`bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Role & Company */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                          Role / Title
                        </label>
                        <Input 
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          placeholder="e.g. Product Manager"
                          className="bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                          Company / Platform
                        </label>
                        <Input 
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Upwork / Client"
                          className="bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                        />
                      </div>
                    </div>

                    {/* Project Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Project / Scope
                      </label>
                      <Input 
                        value={formData.project_name}
                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        placeholder="e.g. Full-Stack Web Application"
                        className="bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                      />
                    </div>

                    {/* Feedback Textarea */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Your Review <span className="text-accent">*</span>
                      </label>
                      <Textarea 
                        rows={4}
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        placeholder="How was the collaboration? Share details about code quality, communication, and speed..."
                        className={`bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent resize-none ${errors.review ? 'border-red-500' : ''}`}
                      />
                      {errors.review && <p className="text-red-400 text-xs mt-1">{errors.review}</p>}
                    </div>

                    {/* Optional Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Email Address <span className="text-white/40 font-normal">(Optional, kept private)</span>
                      </label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. contact@domain.com"
                        className="bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitReview.isPending}
                      className="w-full bg-accent text-black hover:bg-accent/90 py-6 rounded-xl font-display font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/30 transition-all mt-4"
                    >
                      <Send className="w-4 h-4" />
                      {submitReview.isPending ? "Submitting..." : "Submit Freelancer Rating"}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Reviews List Showcase */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Controls: Search and Star Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-card p-4 rounded-2xl border border-white/10">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="bg-black/40 border-white/10 pl-9 text-xs text-white placeholder:text-white/40 h-9 rounded-xl focus-visible:ring-accent"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedFilter(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedFilter === null ? "bg-accent text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    All ({reviews.length})
                  </button>
                  {[5, 4].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedFilter(star)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                        selectedFilter === star ? "bg-accent text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews Cards List */}
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-accent mx-auto" />
                </div>
              ) : filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredReviews.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card border border-white/10 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 relative group"
                      >
                        {/* Rating Stars & Date */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-4 h-4 ${s <= item.rating ? "fill-accent text-accent" : "text-white/10"}`} 
                              />
                            ))}
                            <span className="text-xs font-bold text-accent ml-2 uppercase tracking-wider">
                              {item.rating}.0
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-white/40">
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>

                        {/* Review text */}
                        <p className="font-body text-white/90 text-sm leading-relaxed mb-4 italic">
                          "{item.review}"
                        </p>

                        {/* Project Tag */}
                        {item.project_name && (
                          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                            <span className="text-accent font-bold">Project:</span>
                            <span className="truncate max-w-xs">{item.project_name}</span>
                          </div>
                        )}

                        {/* Author info */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent/30 to-sky-400/30 border border-white/10 flex items-center justify-center font-display font-bold text-xs text-white">
                              {item.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                                <span>{item.name}</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                              </div>
                              <div className="text-xs text-portfolio-muted font-body">
                                {item.role} {item.company ? `• ${item.company}` : ""}
                              </div>
                            </div>
                          </div>

                          {item.featured && (
                            <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-bold text-accent uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 glass-card rounded-2xl border border-white/10 p-8">
                  <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-white text-base">No reviews matched</h3>
                  <p className="text-portfolio-muted text-xs mt-1">Try resetting the filter or search term</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RateWork;
