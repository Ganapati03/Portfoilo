import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Contact } from "@/components/portfolio/Contact";
import Blog from "@/components/portfolio/Blog";

const PublicBlogPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="pt-20">
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default PublicBlogPage;
