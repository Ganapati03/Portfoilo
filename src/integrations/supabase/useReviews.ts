import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./client";

export interface Review {
  id: string;
  name: string;
  role?: string;
  company?: string;
  project_name?: string;
  rating: number; // 1 to 5
  review: string;
  email?: string;
  avatar_url?: string;
  approved: boolean;
  featured?: boolean;
  created_at: string;
}

export type ReviewInput = Omit<Review, "id" | "created_at" | "approved" | "featured"> & {
  approved?: boolean;
  featured?: boolean;
};

// Default seed reviews to ensure a vibrant initial state
const defaultSeedReviews: Review[] = [
  {
    id: "seed-1",
    name: "Marcus Vance",
    role: "Tech Lead & Full Stack Engineer",
    company: "Upwork Client",
    project_name: "React & TypeScript SaaS Dashboard",
    rating: 5,
    review: "Ganapati delivered high-velocity code with exceptional attention to modern UI/UX design. The animations and API architecture were rock solid. Truly a pleasure to collaborate with!",
    approved: true,
    featured: true,
    created_at: "2026-03-15T10:00:00Z"
  },
  {
    id: "seed-2",
    name: "Elena Rostova",
    role: "Freelance UI/UX Designer",
    company: "Design Collab",
    project_name: "Quantum Portfolio & Interactive Web",
    rating: 5,
    review: "Incredible front-end execution! He took Figma designs and brought them to life with buttery smooth Framer Motion interactions and responsive layouts.",
    approved: true,
    featured: true,
    created_at: "2026-02-20T14:30:00Z"
  },
  {
    id: "seed-3",
    name: "David Chen",
    role: "Startup Founder",
    company: "Fintech Agency",
    project_name: "Supabase & Postgres Integration",
    rating: 5,
    review: "Very communicative, met all deadlines ahead of schedule, and optimized backend query performance. Highly recommended for freelance web apps.",
    approved: true,
    featured: false,
    created_at: "2026-01-10T09:15:00Z"
  }
];

const LOCAL_STORAGE_KEY = "freelance_portfolio_reviews";

const getLocalReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return defaultSeedReviews;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSeedReviews;
  } catch {
    return defaultSeedReviews;
  }
};

const saveLocalReviews = (reviews: Review[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error("Failed to save local reviews", err);
  }
};

// Fetch approved reviews for public page
export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews", "approved"],
    queryFn: async (): Promise<Review[]> => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("approved", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Reviews table query failed, falling back to local reviews:", error.message);
          return getLocalReviews().filter(r => r.approved);
        }

        if (!data || data.length === 0) {
          // If database is empty, provide seed reviews for great initial look
          return getLocalReviews().filter(r => r.approved);
        }

        return data as Review[];
      } catch {
        return getLocalReviews().filter(r => r.approved);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch all reviews for admin panel
export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async (): Promise<Review[]> => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Reviews table query failed, falling back to local reviews:", error.message);
          return getLocalReviews();
        }

        if (!data || data.length === 0) {
          return getLocalReviews();
        }

        return data as Review[];
      } catch {
        return getLocalReviews();
      }
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Submit a new review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewInput: ReviewInput): Promise<Review> => {
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        name: reviewInput.name,
        role: reviewInput.role || "Freelancer / Client",
        company: reviewInput.company || "Independent",
        project_name: reviewInput.project_name || "General Collaboration",
        rating: reviewInput.rating,
        review: reviewInput.review,
        email: reviewInput.email || "",
        avatar_url: reviewInput.avatar_url || "",
        approved: reviewInput.approved ?? true,
        featured: reviewInput.featured ?? false,
        created_at: new Date().toISOString(),
      };

      // 1. Try saving to Supabase reviews table
      let supabaseSuccess = false;
      try {
        const { data, error } = await supabase
          .from("reviews")
          .insert({
            name: newReview.name,
            role: newReview.role,
            company: newReview.company,
            project_name: newReview.project_name,
            rating: newReview.rating,
            review: newReview.review,
            email: newReview.email,
            avatar_url: newReview.avatar_url,
            approved: newReview.approved,
            featured: newReview.featured,
          })
          .select()
          .single();

        if (!error && data) {
          supabaseSuccess = true;
          newReview.id = data.id;
        }
      } catch (err) {
        console.warn("Supabase review insert failed, using fallback:", err);
      }

      // 2. Also log as lead/message so admin is alerted
      try {
        await supabase.from("messages").insert({
          name: newReview.name,
          email: newReview.email || "review@freelancer.portfolio",
          message: `[New Freelancer Review: ${newReview.rating}/5 Stars]\nRole: ${newReview.role}\nCompany: ${newReview.company}\nProject: ${newReview.project_name}\nReview: ${newReview.review}`,
        });
      } catch {
        // optional background notification
      }

      // 3. Always maintain local copy
      const local = getLocalReviews();
      saveLocalReviews([newReview, ...local]);

      return newReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// Toggle approved/featured or update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updated: Partial<Review> & { id: string }) => {
      try {
        await supabase
          .from("reviews")
          .update(updated)
          .eq("id", updated.id);
      } catch {
        // ignore
      }

      // Update local storage
      const local = getLocalReviews();
      const updatedLocal = local.map(r => r.id === updated.id ? { ...r, ...updated } : r);
      saveLocalReviews(updatedLocal);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await supabase.from("reviews").delete().eq("id", id);
      } catch {
        // ignore
      }

      // Remove from local storage
      const local = getLocalReviews();
      saveLocalReviews(local.filter(r => r.id !== id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
