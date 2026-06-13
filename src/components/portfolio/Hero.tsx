import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { useProfile } from "@/integrations/supabase/hooks";
import ScrollyCanvas from "./ScrollyCanvas";

export const Hero = () => {
  const { data: profile, isLoading } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const phase1Opacity = useTransform(smoothProgress, [0, 0.1, 0.2, 0.25], [1, 1, 1, 0]);
  const phase1Y = useTransform(smoothProgress, [0, 0.25], [0, -50]);
  const phase2Opacity = useTransform(smoothProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const phase2Y = useTransform(smoothProgress, [0.25, 0.5], [50, -50]);
  const phase3Opacity = useTransform(smoothProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const phase3Y = useTransform(smoothProgress, [0.5, 0.75], [50, -50]);
  const phase4Opacity = useTransform(smoothProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const phase4Y = useTransform(smoothProgress, [0.75, 1], [50, 0]);

  // Ambient audio logic (auto-play on WelcomeGate close)
  useEffect(() => {
    const audio = new Audio("/hero-ambient.wav");
    audio.loop = false;
    audio.preload = "auto";
    audio.volume = 1.0;
    audioRef.current = audio;

    const onWelcomeClose = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Autoplay blocked. User interaction required:", err);
      });
    };

    const onAudioEnded = () => {
      setIsPlaying(false);
    };

    window.addEventListener("welcomeGateClosed", onWelcomeClose);
    audio.addEventListener("ended", onAudioEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      window.removeEventListener("welcomeGateClosed", onWelcomeClose);
      audio.removeEventListener("ended", onAudioEnded);
    };
  }, []);

  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const nameParts = profile?.full_name ? profile.full_name.split(" ") : ["John", "Doe"];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section ref={containerRef} id="home" className="relative w-full h-[500vh] bg-background">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 z-0">
              <ScrollyCanvas scrollContainerRef={containerRef} frameCount={120} />
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">

              <motion.div
                style={{ opacity: phase1Opacity, y: phase1Y }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <h1 className="font-display font-black text-[15vw] leading-[0.9] text-white/5 tracking-[-0.04em] uppercase whitespace-nowrap">
                  {profile?.full_name || "DEVELOPER"}
                </h1>
              </motion.div>

              <motion.div
                style={{ opacity: phase2Opacity, y: phase2Y }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <span className="font-display font-medium text-portfolio-muted text-xl tracking-[0.1em] uppercase mb-6">
                  {profile?.title || "Creative Developer"}
                </span>
                <div className="font-display font-extrabold text-4xl sm:text-6xl md:text-8xl tracking-[-0.04em] leading-[0.9] text-white mb-4">
                  Hi, I'm {firstName} <span className="text-accent">{lastName}</span>
                </div>
              </motion.div>

              <motion.div
                style={{ opacity: phase3Opacity, y: phase3Y }}
                className="absolute inset-0 flex items-center justify-center text-center px-4"
              >
                <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-7xl leading-[1.1] tracking-[-0.03em] text-white max-w-4xl">
                  {profile?.bio?.split('.')[0] || "Full Stack Developer & Creative Problem Solver"}
                </h2>
              </motion.div>

              <motion.div
                style={{ opacity: phase4Opacity, y: phase4Y }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-6xl leading-[1.1] tracking-[-0.03em] text-white max-w-3xl mb-8 sm:mb-12">
                  Building Modern Digital Experiences <br className="hidden sm:block" />
                  <span className="text-portfolio-muted italic font-body font-normal text-xl sm:text-2xl md:text-4xl mt-3 block leading-[1.6]">
                    Through Code & Innovation
                  </span>
                </h2>
                <div className="pointer-events-auto">
                  <button
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-accent/10 border border-accent/50 text-white px-8 py-4 rounded-full font-display font-semibold tracking-[0.12em] text-sm uppercase hover:bg-accent hover:text-black transition-all duration-300 backdrop-blur-md"
                  >
                    Discover More
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Ambient audio toggle — z-50 ensures it's always on top and clickable */}
            <button
              onClick={handleToggleAudio}
              title={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
              className="absolute top-32 right-8 md:right-12 z-50 w-12 h-12 rounded-full bg-black/40 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-accent hover:border-accent hover:text-black text-white transition-all duration-300 group"
            >
              {isPlaying ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-40 pointer-events-none" />
              )}
            </button>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
