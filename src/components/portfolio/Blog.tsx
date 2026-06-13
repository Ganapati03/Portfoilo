import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Search, Loader2 } from "lucide-react";
import { usePublishedBlogPosts } from "@/integrations/supabase/hooks";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <section id="blog" className="py-24 flex justify-center bg-[#0d0d0d]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </section>
    );
  }

  if (!posts || posts.length === 0) return null;

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = filteredPosts.slice(1);

  return (
    <section id="blog" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      {/* Decorative Cinematic Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-[1400px] relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div>
            <span className="font-display font-medium tracking-[0.1em] text-xs uppercase text-accent mb-6 block">
              Knowledge & Insights
            </span>
            <h2 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.03em] leading-[1.1] text-white">
              Latest Articles
            </h2>
          </div>

          <div className="relative max-w-md w-full shrink-0 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white font-body font-medium focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all backdrop-blur-md"
            />
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Featured Post (Spans 2 columns on desktop) */}
          {featuredPost && (
            <motion.a
              href={`/blog/${featuredPost.slug || featuredPost.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative lg:col-span-2 h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 block bg-[#111]"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 ease-[0.16,1,0.3,1]"
                style={{ backgroundImage: `url(${featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'})` }}
              />
              
              {/* Cinematic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/80 via-transparent to-transparent opacity-60" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 flex flex-col justify-end h-full">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-accent text-black font-display font-medium tracking-[0.1em] uppercase text-[10px] shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                    Featured
                  </span>
                  <span className="flex items-center gap-2 text-white/70 text-xs font-display font-medium tracking-[0.1em] uppercase backdrop-blur-md px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold tracking-[-0.02em] text-white mb-6 leading-[1.2] group-hover:text-accent transition-colors duration-500 max-w-3xl drop-shadow-2xl">
                  {featuredPost.title}
                </h3>
                
                <p className="font-body font-normal md:font-medium leading-[1.7] text-white/70 text-base md:text-lg mb-10 max-w-2xl line-clamp-2">
                  {featuredPost.excerpt || featuredPost.content.substring(0, 150) + "..."}
                </p>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-auto">
                  <div className="flex gap-2 flex-wrap">
                    {featuredPost.tags && featuredPost.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span key={idx} className="px-4 py-1.5 font-display font-medium tracking-[0.1em] text-[10px] uppercase rounded-full border border-white/20 text-white bg-white/5 backdrop-blur-md group-hover:border-white/40 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 backdrop-blur-md bg-white/5">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-black group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>
          )}

          {/* Regular Posts Grid (Spans 1 column each) */}
          {regularPosts.map((post, index) => (
            <motion.a
              href={`/blog/${post.slug || post.id}`}
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 block bg-[#111]"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 ease-[0.16,1,0.3,1]"
                style={{ backgroundImage: `url(${post.featured_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'})` }}
              />
              
              {/* Cinematic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-black/20 opacity-90 group-hover:opacity-80 transition-opacity duration-700" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end h-full">
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-display font-medium tracking-[0.1em] uppercase mb-6 backdrop-blur-md px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-[-0.02em] text-white mb-4 leading-[1.2] group-hover:text-accent transition-colors duration-500 line-clamp-3">
                  {post.title}
                </h3>
                
                <p className="font-body font-normal text-white/70 leading-[1.7] text-sm mb-8 line-clamp-3">
                  {post.excerpt || post.content.substring(0, 100) + "..."}
                </p>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                  <div className="flex gap-2 flex-wrap">
                    {post.tags && post.tags.slice(0, 2).map((tag: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 font-display font-medium tracking-[0.1em] text-[10px] uppercase rounded-full border border-white/10 text-white/70 bg-white/5 backdrop-blur-md group-hover:border-white/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 bg-white/5">
                    <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-32 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md mt-10">
            <p className="font-display font-semibold tracking-[0.1em] uppercase text-xl text-white/40">No articles found</p>
            <p className="font-body font-normal text-white/50 mt-4">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
