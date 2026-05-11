import React, { useRef } from "react";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { HeroButton } from "@/components/ui/hero-button";


const Hero = () => {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // Main content entrance
      tl.from(".hero-reveal", {
        y: 60,
        opacity: 0,
        filter: "blur(12px)",
        scale: 0.9,
        duration: 1.4,
        stagger: {
          amount: 0.6,
          ease: "power2.inOut",
        },
      });

      // Individual button stagger
      tl.from(
        ".cta-button",
        {
          x: -20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.8",
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 z-[4] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[4] bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

      {/* Content */}
      <div className="hero-content relative z-[5] flex flex-col items-center text-center gap-8 px-6 max-w-5xl">
        {/* Eyebrow tag */}
        <div className="hero-reveal flex items-center gap-2 border border-primary/20 rounded-full px-5 py-2 mt-8 bg-primary/5 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase text-primary/80 ">
            Now Accepting Projects
          </span>
        </div>

        {/* Main heading */}
        <h1 className="hero-reveal text-4xl md:text-5xl lg:text-7xl leading-[0.9] font-black">
          We Build
          <br />
          <span className="text-primary neon-text-glow">High Performance</span>
          <br />
          Digital Experiences
        </h1>

        {/* Subtext */}
        <p
          className="hero-reveal text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Crafting blazing-fast websites, intelligent AI chatbots, and immersive
          digital products for forward-thinking brands worldwide.
        </p>

        {/* CTA buttons */}
        <div className="hero-reveal flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
          <HeroButton className="cta-button w-full sm:w-auto">
            Get Started
          </HeroButton>
          <InteractiveHoverButton className="cta-button w-full sm:w-auto">
            View Our Services
          </InteractiveHoverButton>
        </div>

        {/* Social proof */}
        <div className="hero-reveal flex items-center gap-4 mt-2">
          <AvatarCircles
            numPeople={99}
            avatarUrls={[
              {
                imageUrl: "https://avatars.githubusercontent.com/u/16860528",
                profileUrl: "https://github.com/dillionverma",
              },
              {
                imageUrl: "https://avatars.githubusercontent.com/u/20110627",
                profileUrl: "https://github.com/",
              },
              {
                imageUrl: "https://avatars.githubusercontent.com/u/106103625",
                profileUrl: "https://github.com/",
              },
              {
                imageUrl: "https://avatars.githubusercontent.com/u/59228569",
                profileUrl: "https://github.com/",
              },
            ]}
          />
          <span
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Trusted by <strong className="text-white">99+</strong> clients
            worldwide
          </span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5] pointer-events-none" />
      
    </div>
  );
};

export default Hero;
