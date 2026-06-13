import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Services } from "@/components/portfolio/Services";
import { Contact } from "@/components/portfolio/Contact";

const PublicServicesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="pt-20">
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default PublicServicesPage;
