import React, { useEffect, useRef } from "react";
import { CheckCircle2, ArrowRight, Brain } from "lucide-react";
import aboutImg from "../../assets/images/about.png";

const FEATURES = [
  "AI-Driven Automation & Workflows",
  "Scalable Cloud Architecture",
  "Conversion-Optimized Interfaces",
  "Real-Time Analytics & Insights",
  "End-to-End Product Strategy",
  "24/7 Dedicated Support",
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-background py-28 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase font-heading">
              Who We Are
            </span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2
            className={`text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight font-heading uppercase leading-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Building the Future <br />
            <span className="text-primary neon-text-glow">with AI</span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Side */}
          <div
            className={`relative group transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            {/* Outer glow on hover */}
            <div className="absolute -inset-3 bg-primary/10 blur-2xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Primary accent line */}
            <div className="absolute -left-4 top-8 bottom-8 w-1 bg-primary/60 rounded-full" />

            {/* The image */}
            <div className="relative overflow-hidden border border-white/10">
              <img
                src={aboutImg}
                alt="BetterWeb AI-powered team collaborating on digital solutions"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating stat badge */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-[#0a0a0a] border border-white/10 px-6 py-5 z-20 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 flex items-center justify-center border border-primary/30">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-white font-black font-heading uppercase text-2xl tracking-tight">
                    AI-First
                  </p>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest font-sans">
                    Development Approach
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div
            className={`flex flex-col transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-sans">
              At <span className="text-white font-semibold">BetterWeb</span>, we
              are more than a web agency — we are your strategic digital
              partner. By fusing cutting-edge artificial intelligence with
              elite-tier development practices, we architect digital platforms
              that don't just exist, they{" "}
              <span className="text-primary font-semibold">dominate</span>.
            </p>

            <p className="text-muted-foreground text-base mb-10 leading-relaxed font-sans">
              From intelligent automation to conversion-driven interfaces, our
              team of developers, designers, and AI engineers work together to
              deliver scalable solutions for brands ready to lead their
              industry. We've helped over 150 businesses achieve exponential
              digital growth — and we're just getting started.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-12">
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 group/item"
                  style={{
                    transitionDelay: isVisible ? `${500 + idx * 80}ms` : "0ms",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transition: "all 0.6s ease-out",
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-white/80 text-sm font-sans group-hover/item:text-primary transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="btn-neon w-fit flex items-center gap-3 group">
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
