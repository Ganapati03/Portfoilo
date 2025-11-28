# Blog Feature Setup Guide

## Overview
This guide will help you set up the blog feature for your portfolio. The blog system includes:
- ✅ Admin panel for creating, editing, and managing blog posts
- ✅ Rich text editor with Markdown support
- ✅ Featured image uploads
- ✅ Tags and categories
- ✅ SEO optimization fields
- ✅ Draft/Published status
- ✅ View count tracking
- ✅ Automatic read time calculation
- ✅ Public-facing blog display

## Database Setup

### Step 1: Run the SQL Schema

You need to apply the blog-related SQL to your Supabase database. Go to your Supabase project dashboard:

1. Navigate to **SQL Editor**
2. Run the following SQL commands:

```sql
-- BLOG TABLE
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image_url text,
  tags text[],
  published boolean default false,
  view_count integer default 0,
  read_time integer,
  author_name text,
  seo_title text,
  seo_description text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index blog_posts_slug_idx on public.blog_posts(slug);
create index blog_posts_published_idx on public.blog_posts(published);
create index blog_posts_published_at_idx on public.blog_posts(published_at desc);
create index blog_posts_tags_idx on public.blog_posts using gin(tags);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Blog policies
create policy "Public can view published blogs." on public.blog_posts for select using (published = true);
create policy "Authenticated users can view all blogs." on public.blog_posts for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert blogs." on public.blog_posts for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update blogs." on public.blog_posts for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete blogs." on public.blog_posts for delete using (auth.role() = 'authenticated');
```

### Step 2: Create Storage Bucket for Blog Images

In the Supabase dashboard:

1. Go to **Storage** section
2. Click **New Bucket**
3. Name it: `blog-images`
4. Make it **Public**
5. Click **Create Bucket**

Then run these storage policies in the SQL Editor:

```sql
-- Storage policies for blog images
create policy "Public can view blog images"
on storage.objects for select
using ( bucket_id = 'blog-images' );

create policy "Authenticated users can upload blog images"
on storage.objects for insert
with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update blog images"
on storage.objects for update
using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete blog images"
on storage.objects for delete
using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
```

## Features

### Admin Panel (`/admin/blog`)

The admin blog management page allows you to:

1. **Create New Posts**
   - Click "New Post" button
   - Fill in the title (required)
   - Add content using Markdown (required)
   - Upload a featured image
   - Add tags (comma-separated)
   - Set SEO title and description
   - Save as draft or publish immediately

2. **Edit Existing Posts**
   - Click the edit icon on any post
   - Modify any field
   - Update and save changes

3. **Publish/Unpublish**
   - Toggle the eye icon to publish or unpublish
   - Published posts appear on the public portfolio
   - Drafts are only visible in the admin panel

4. **Delete Posts**
   - Click the trash icon
   - Confirm deletion

### Public Display

Published blog posts automatically appear on your portfolio homepage in the "Latest Blog Posts" section with:
- Featured image
- Title and excerpt
- Publication date
- Read time
- View count
- Tags
- "Read More" button

### Auto-Generated Features

1. **Slug Generation**: If you don't provide a slug, it's automatically generated from the title
2. **Read Time**: Automatically calculated based on word count (200 words/minute)
3. **Published Date**: Set automatically when you publish a post

## Writing Blog Posts

### Markdown Support

The content field supports Markdown formatting:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

![Image alt text](image-url)

`inline code`

\`\`\`javascript
// Code block
const hello = "world";
\`\`\`
```

### SEO Best Practices

1. **Title**: Keep it under 60 characters
2. **SEO Title**: Optimize for search engines (can be different from display title)
3. **Excerpt**: Write a compelling 150-160 character summary
4. **SEO Description**: Meta description for search results (150-160 characters)
5. **Tags**: Use relevant, specific tags (3-5 recommended)
6. **Featured Image**: Use high-quality images (recommended: 1200x630px)

### Image Upload

When uploading images:
- Supported formats: JPG, PNG, GIF, WebP
- Recommended size: Under 2MB for fast loading
- Images are stored in Supabase Storage
- Public URLs are automatically generated

## Customization

### Changing Blog Display

Edit `src/components/portfolio/Blog.tsx` to customize:
- Number of posts shown (currently shows all)
- Card layout and styling
- Metadata displayed
- Read More button behavior

### Adding Blog Detail Pages

Currently, the "Read More" button scrolls to top. To add individual blog post pages:

1. Create a new route in `App.tsx`:
```tsx
<Route path="/blog/:slug" element={<BlogPost />} />
```

2. Create `src/pages/BlogPost.tsx` to display full post content

3. Update the "Read More" button in `Blog.tsx`:
```tsx
onClick={() => navigate(`/blog/${post.slug}`)}
```

## Troubleshooting

### Images Not Uploading
- Check that the `blog-images` bucket exists in Supabase Storage
- Verify storage policies are set correctly
- Ensure bucket is set to **Public**

### Posts Not Showing on Portfolio
- Verify posts are marked as **Published** (not draft)
- Check RLS policies are applied correctly
- Ensure `published_at` date is set

### Slug Conflicts
- Each slug must be unique
- If you get an error, change the slug or let it auto-generate

## Next Steps

Consider adding:
- [ ] Blog post detail pages with full content
- [ ] Comments system
- [ ] Social sharing buttons
- [ ] Related posts
- [ ] Search functionality
- [ ] Categories/filtering
- [ ] RSS feed
- [ ] Newsletter integration

## Support

If you encounter any issues, check:
1. Supabase dashboard for error logs
2. Browser console for client-side errors
3. Network tab to verify API calls
