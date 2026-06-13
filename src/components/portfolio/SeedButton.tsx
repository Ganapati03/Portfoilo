import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SeedButton = () => {
  const [status, setStatus] = useState("Seed Blog");

  const handleSeed = async () => {
    setStatus("Seeding...");
    const newBlog = {
      title: "The Future of AI in Software Engineering",
      slug: "future-of-ai-software-engineering-" + Date.now(), // Ensure unique slug
      excerpt: "Exploring how LLMs and agentic AI are fundamentally changing the way developers write, test, and deploy code in the modern tech ecosystem.",
      content: `
  <h1>The Future of AI in Software Engineering</h1>
  <p>Artificial Intelligence is no longer just a buzzword; it is actively reshaping the software engineering landscape. From auto-completing code snippets to entire agentic AI systems designing architectures, the role of a software engineer is evolving.</p>
  
  <h2>Beyond Copilots: Agentic AI</h2>
  <p>While tools like GitHub Copilot introduced developers to AI assistance, the next frontier is <strong>Agentic AI</strong>. These systems don't just suggest code; they reason, plan, and execute multi-step workflows. They can navigate codebases, read documentation, and even run tests autonomously.</p>
  
  <h3>What This Means for Developers</h3>
  <ul>
    <li><strong>Shift in Focus:</strong> Developers will spend less time on boilerplate and more time on high-level system design.</li>
    <li><strong>New Skills:</strong> Prompt engineering and AI orchestration will become essential skills.</li>
    <li><strong>Increased Velocity:</strong> Teams will ship features faster and with higher confidence as AI helps catch bugs before they merge.</li>
  </ul>
  
  <blockquote>
    "The future software engineer is an orchestrator of AI agents, not just a writer of code."
  </blockquote>
  
  <h2>Preparing for the Shift</h2>
  <p>To stay ahead, developers should embrace these tools early. Understanding how LLMs reason, their limitations, and how to effectively guide them is crucial. The AI won't replace engineers; it will empower them to build more complex and impactful systems than ever before.</p>
      `,
      featured_image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop",
      tags: ["AI", "Engineering", "Future"],
      published: true,
      view_count: 0,
      read_time: 5,
      author_name: "Admin",
      seo_title: "Future of AI Software Engineering",
      seo_description: "How AI is changing software development.",
      published_at: new Date().toISOString()
    };

    const { error } = await supabase.from('blog_posts').insert([newBlog]);
    if (error) {
      console.error(error);
      setStatus("Error (Must be logged in to /admin)");
    } else {
      setStatus("Success! Refresh page.");
    }
  };

  return (
    <button 
      onClick={handleSeed}
      className="fixed top-24 right-4 z-50 bg-accent text-black px-4 py-2 rounded-full font-bold shadow-2xl"
    >
      {status}
    </button>
  );
};
