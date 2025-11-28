import { motion } from "framer-motion";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublishedBlogPosts } from "@/integrations/supabase/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedBlogPosts();

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
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null; // Don't show the section if there are no published posts
  }

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on technology and development
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="glass-strong border-primary/20 overflow-hidden h-full flex flex-col hover:glow-cyan transition-all group">
                {post.featured_image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-foreground/50 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                    {post.read_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.read_time} min read
                      </span>
                    )}
                    {post.view_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.view_count}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                    {post.title}
                  </h3>

                  <p className="text-foreground/60 text-sm mb-4 line-clamp-3 flex-1">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-primary/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full rounded-xl border border-primary/30 hover:bg-primary/10 group/btn"
                    onClick={() => {
                      // For now, we'll scroll to top. You can implement a blog detail page later
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {posts.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              onClick={() => {
                // Navigate to blog archive page (to be implemented)
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
