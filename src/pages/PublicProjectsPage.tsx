import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";

const PublicProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="pt-20">
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default PublicProjectsPage;
