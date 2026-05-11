import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const brands = [
  "Google",
  "Amazon",
  "Microsoft",
  "Netflix",
  "Spotify",
  "Tesla",
  "Whatsapp",
  "Adobe",
  "Slack",
];

const BrandMarquee = () => {
  const marqueeRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(
    () => {
      // Infinite continuous scroll
      gsap.to(lineRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });

      // Scroll-triggered velocity shift
      gsap.to(lineRef.current, {
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        x: -300,
      });
    },
    { scope: marqueeRef },
  );

  return (
    <div
      ref={marqueeRef}
      className="py-12 overflow-hidden bg-background relative z-10 select-none border-y border-white/5"
    >
      <div className="absolute inset-0 z-0 bg-primary/2 opacity-[0.02] pointer-events-none" />

      <div className="flex whitespace-nowrap" ref={lineRef}>
        {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center mx-6 md:mx-10">
            <span className="text-2xl md:text-5xl font-bold opacity-30 hover:opacity-100 hover:bg-primary rounded-lg hover:text-black px-4 py-1 transition-all duration-500 font-heading uppercase tracking-tight cursor-pointer">
              {brand}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-6 md:mx-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
