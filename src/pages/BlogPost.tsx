import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useBlogPostBySlug, useIncrementBlogView } from "@/integrations/supabase/hooks";
import { useEffect, useRef } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || "");
  const incrementView = useIncrementBlogView();
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (post?.id && !hasIncremented.current) {
      incrementView.mutate(post.id);
      hasIncremented.current = true;
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-display font-black text-white mb-4 tracking-widest uppercase">Article Not Found</h1>
        <p className="text-white/50 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/#blog" className="px-6 py-3 bg-accent text-black font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Hero Header */}
      <div className="relative h-[50vh] md:h-[70vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.featured_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-black/30" />
        
        <div className="absolute inset-0 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between container mx-auto max-w-[1000px] z-10">
          <Link to="/#blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors w-fit group backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-bold">Back to Articles</span>
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-auto max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="flex items-center gap-2 text-white/70 text-xs font-bold tracking-widest uppercase backdrop-blur-md px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {post.tags?.map((tag: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full border border-accent/30 text-accent bg-accent/5 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl mb-4">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <main className="container mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="
            [&>h1]:text-4xl [&>h1]:font-display [&>h1]:font-black [&>h1]:mb-8 [&>h1]:mt-12 [&>h1]:text-white
            [&>h2]:text-3xl [&>h2]:font-display [&>h2]:font-black [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:text-white
            [&>h3]:text-2xl [&>h3]:font-display [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:text-white
            [&>p]:text-white/70 [&>p]:leading-loose [&>p]:mb-8 [&>p]:text-[1.1rem]
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul]:text-white/70 [&>ul>li]:mb-3 [&>ul>li]:leading-relaxed
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol]:text-white/70 [&>ol>li]:mb-3 [&>ol>li]:leading-relaxed
            [&>a]:text-accent [&>a]:hover:underline [&>a]:transition-all
            [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:text-white/60 [&>blockquote]:my-10 [&>blockquote]:bg-white/5 [&>blockquote]:rounded-r-2xl
            [&>pre]:bg-[#111] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-2xl [&>pre]:p-6 [&>pre]:overflow-x-auto [&>pre]:my-10
            [&>p>code]:text-accent [&>p>code]:bg-accent/10 [&>p>code]:px-2 [&>p>code]:py-1 [&>p>code]:rounded-md [&>p>code]:font-mono [&>p>code]:text-sm
            [&>img]:rounded-[2rem] [&>img]:border [&>img]:border-white/10 [&>img]:my-12 [&>img]:w-full [&>img]:shadow-2xl
            [&>hr]:border-white/10 [&>hr]:my-12
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Footer actions */}
        <div className="mt-24 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
            Thanks for reading
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors font-bold tracking-widest uppercase text-xs"
            >
              Share Article
            </button>
            <Link to="/#blog" className="px-6 py-3 rounded-full bg-accent text-black hover:bg-white transition-colors font-bold tracking-widest uppercase text-xs">
              More Articles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
