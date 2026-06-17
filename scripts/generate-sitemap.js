import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DOMAIN = 'https://ganapatigoud.me';

const staticRoutes = [
  '/',
  '/blog',
  '/services',
  '/projects'
];

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  staticRoutes.forEach(route => {
    const url = `${DOMAIN}${route}`;
    sitemapXML += `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Fetch dynamic blog posts
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('published', true);

    if (error) throw error;

    if (posts) {
      posts.forEach(post => {
        const url = `${DOMAIN}/blog/${post.slug}`;
        const lastMod = post.updated_at || post.published_at || new Date().toISOString();
        
        sitemapXML += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }
  } catch (error) {
    console.error('Failed to fetch blog posts from Supabase:', error);
    // Proceed to write the static ones anyway
  }

  sitemapXML += `\n</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXML, 'utf-8');
  console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap();
