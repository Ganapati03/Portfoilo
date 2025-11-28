import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, FileText, Calendar } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useBlogPosts,
  useAddBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  useToggleBlogPublish,
  useUploadImage,
} from "@/integrations/supabase/hooks";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];

const BlogPage = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const addPost = useAddBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const togglePublish = useToggleBlogPublish();
  const uploadImage = useUploadImage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<BlogPostInsert>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    tags: [],
    published: false,
    read_time: 0,
    author_name: "",
    seo_title: "",
    seo_description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image_url: "",
      tags: [],
      published: false,
      read_time: 0,
      author_name: "",
      seo_title: "",
      seo_description: "",
    });
    setEditingPost(null);
    setImageFile(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      featured_image_url: post.featured_image_url || "",
      tags: post.tags || [],
      published: post.published,
      read_time: post.read_time || 0,
      author_name: post.author_name || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return formData.featured_image_url;

    setIsUploading(true);
    try {
      const url = await uploadImage.mutateAsync({
        file: imageFile,
        bucket: "blog-images",
      });
      toast.success("Image uploaded successfully");
      return url;
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
      return formData.featured_image_url;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image if selected
    const imageUrl = await handleImageUpload();

    // Auto-generate slug if empty
    const slug = formData.slug || generateSlug(formData.title);

    // Calculate read time
    const readTime = calculateReadTime(formData.content);

    const postData: BlogPostInsert = {
      ...formData,
      slug,
      read_time: readTime,
      featured_image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    if (editingPost) {
      updatePost.mutate(
        { id: editingPost.id, ...postData },
        {
          onSuccess: () => {
            toast.success("Blog post updated successfully");
            setIsDialogOpen(false);
            resetForm();
          },
          onError: (error: any) => {
            toast.error(`Error updating post: ${error.message}`);
          },
        }
      );
    } else {
      addPost.mutate(postData, {
        onSuccess: () => {
          toast.success("Blog post created successfully");
          setIsDialogOpen(false);
          resetForm();
        },
        onError: (error: any) => {
          toast.error(`Error creating post: ${error.message}`);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deletePost.mutate(id, {
        onSuccess: () => {
          toast.success("Blog post deleted successfully");
        },
        onError: (error: any) => {
          toast.error(`Error deleting post: ${error.message}`);
        },
      });
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    togglePublish.mutate(
      { id, published: !currentStatus },
      {
        onSuccess: () => {
          toast.success(
            currentStatus
              ? "Blog post unpublished successfully"
              : "Blog post published successfully"
          );
        },
        onError: (error: any) => {
          toast.error(`Error updating publish status: ${error.message}`);
        },
      }
    );
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
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Blog Posts</h1>
          <p className="text-foreground/60">Create and manage your blog content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-primary/20 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="gradient-text">
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass border-primary/20"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="slug">
                    Slug (URL-friendly, auto-generated if empty)
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="glass border-primary/20"
                    placeholder="my-awesome-blog-post"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="glass border-primary/20 min-h-[80px]"
                    placeholder="A brief summary of your blog post..."
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="content">Content (Markdown supported) *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="glass border-primary/20 min-h-[300px] font-mono text-sm"
                    required
                    placeholder="Write your blog content here... You can use Markdown formatting."
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="glass border-primary/20"
                  />
                  {formData.featured_image_url && (
                    <p className="text-xs text-foreground/50 mt-1">
                      Current: {formData.featured_image_url}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      })
                    }
                    className="glass border-primary/20"
                    placeholder="react, typescript, web development"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={formData.author_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, author_name: e.target.value })
                    }
                    className="glass border-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_title: e.target.value })
                    }
                    className="glass border-primary/20"
                    placeholder="Optimized title for search engines"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_description: e.target.value })
                    }
                    className="glass border-primary/20 min-h-[60px]"
                    placeholder="Meta description for search engines (150-160 characters)"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || addPost.isPending || updatePost.isPending}
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
                >
                  {isUploading || addPost.isPending || updatePost.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    <>{editingPost ? "Update" : "Create"} Post</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-4 max-w-6xl">
        {posts?.map((post) => (
          <Card
            key={post.id}
            className={`glass-strong p-6 border ${
              post.published ? "border-primary/30" : "border-foreground/10"
            } hover:glow-cyan transition-all`}
          >
            <div className="flex gap-6">
              {post.featured_image_url && (
                <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{post.title}</h3>
                      {post.published ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-foreground/10 text-foreground/60 border-foreground/20">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60 line-clamp-2 mb-2">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {post.read_time} min read
                        </span>
                      )}
                      <span>Views: {post.view_count}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {post.tags.map((tag, idx) => (
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
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                      onClick={() => handleTogglePublish(post.id, post.published)}
                    >
                      {post.published ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-primary/50 hover:glow-cyan"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {posts?.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No blog posts yet. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
