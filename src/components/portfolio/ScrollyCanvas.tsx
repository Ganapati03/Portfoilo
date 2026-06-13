import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';

interface ScrollyCanvasProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
  frameCount?: number;
}

const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({ 
  scrollContainerRef, 
  frameCount = 120 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);

  // Use the shared ref from Hero
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  // Apply smooth physics to the raw scroll value
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      
      // Updated filename pattern to match actual files in public/sequence
      const src = `/sequence/frame_${frameNum}_delay-0.066s.webp`;
      img.src = src;
      
      console.log("Loading:", src);
      
      img.onload = () => {
        loadedCount++;
        setLoaded(loadedCount);
        console.log(`Loaded ${loadedCount}/${frameCount} frames`);
      };
      
      img.onerror = () => {
        console.error("Failed image:", src);
        // Fallback: still count to not block UI forever
        loadedCount++;
        setLoaded(loadedCount);
        (img as any).failed = true;
      };

      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [frameCount]);

  const drawFrame = (index: number) => {
    // DO NOT draw until all images are completely loaded
    if (loaded < frameCount) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = images[index];
    if (!img) return;

    // Handle canvas resize dynamically
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ((img as any).failed || !img.complete) {
      // Fallback empty render if somehow failed
      return;
    }

    // Object-fit cover logic for the image
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Listen to frame index changes and draw the corresponding frame
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (loaded === frameCount) {
      const index = Math.floor(latest);
      console.log("Current frame index during scroll:", index);
      drawFrame(index);
    }
  });

  // Initial draw when images fully load or window resizes
  useEffect(() => {
    if (loaded === frameCount) {
      drawFrame(Math.floor(frameIndex.get()));
    }
    
    const handleResize = () => {
      if (loaded === frameCount) {
        drawFrame(Math.floor(frameIndex.get()));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded, images, frameCount, frameIndex]);

  const loadingPercentage = Math.round((loaded / frameCount) * 100);

  return (
    <div className="w-full h-full overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      
      {/* Loading overlay */}
      {loaded < frameCount && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${loadingPercentage}%` }}
              />
            </div>
            <p className="text-xl font-display font-bold tracking-widest text-portfolio-muted uppercase">
              LOADING {loadingPercentage}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollyCanvas;
