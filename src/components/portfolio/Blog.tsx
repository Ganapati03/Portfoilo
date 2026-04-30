import { motion } from "framer-motion";
import { Calendar, Clock, Eye, ArrowRight, Search, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublishedBlogPosts } from "@/integrations/supabase/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 bg-portfolio-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-48 mx-auto mb-4 bg-portfolio-card" />
            <Skeleton className="h-6 w-96 mx-auto bg-portfolio-card" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl bg-portfolio-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null; // Don't show the section if there are no published posts
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 bg-portfolio-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-portfolio-accent mb-4 uppercase tracking-wider">
              Blog
            </h2>
            <p className="text-portfolio-text-sec text-lg max-w-2xl">
              Insights, tutorials, and thoughts on technology and development
            </p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portfolio-muted" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-portfolio-card border border-portfolio-border rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-portfolio-accent transition-colors"
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <div className="glass-card overflow-hidden h-full flex flex-col sm:flex-row group cursor-pointer">
                {post.featured_image_url && (
                  <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden shrink-0">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-portfolio-bg/20 group-hover:bg-transparent transition-colors" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-portfolio-secondary flex items-center justify-center border border-portfolio-border-accent">
                        <User className="w-4 h-4 text-portfolio-accent" />
                      </div>
                      <span className="text-sm font-medium text-white">Author</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-portfolio-text-sec font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-portfolio-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-portfolio-text-sec text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags && post.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border border-portfolio-border text-portfolio-muted group-hover:border-portfolio-border-accent group-hover:text-portfolio-accent transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-5 h-5 text-portfolio-muted group-hover:text-portfolio-accent transition-colors transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-portfolio-muted py-12">
              No posts found matching your search.
            </div>
          )}
        </motion.div>

        {posts.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-portfolio-card border border-portfolio-border text-white px-8 py-3.5 rounded-full font-bold text-sm inline-flex items-center hover:border-portfolio-border-accent hover:text-portfolio-accent transition-all"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
