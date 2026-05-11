import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full bg-[#111111] relative overflow-hidden font-sans">
      {/* ── Top Section ── */}
      <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-2">
            
              <span className="text-lg font-bold text-white tracking-wide">
                Better<span className="text-primary">Web</span>
              </span>
            </div>
            <p className="text-[#666] text-sm mt-2 max-w-[200px]">
              Architecting the next generation of digital experiences.
            </p>
          </div>

          {/* Discover Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-[#999] text-sm font-medium mb-1">Discover</h4>
            <div className="flex flex-col gap-3">
              <a href="#hero" className="text-white/70 hover:text-primary transition-colors text-sm">Home</a>
              <a href="#services" className="text-white/70 hover:text-primary transition-colors text-sm">Services</a>
              <a href="#about" className="text-white/70 hover:text-primary transition-colors text-sm">About</a>
              <a href="#testimonials" className="text-white/70 hover:text-primary transition-colors text-sm">Testimonials</a>
            </div>
          </div>

          {/* Socials Column (Text Links as requested) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-[#999] text-sm font-medium mb-1">Socials</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                WhatsApp
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                LinkedIn
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Instagram
              </a>
              <a href="mailto:hello@betterweb.dev" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Gmail
              </a>
            </div>
          </div>

          {/* Legals Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-[#999] text-sm font-medium mb-1">Legals</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">Cookie Policy</a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">Terms</a>
            </div>
          </div>

          {/* Contact Column (Phone/Email) */}
          <div className="lg:col-span-3 flex flex-col gap-5 lg:items-end">
            <h4 className="text-[#999] text-sm font-medium mb-1">Contact</h4>
            <div className="flex flex-col gap-3 lg:items-end">
              <a href="tel:+919876543210" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-tight">
                +91 98765-43210
              </a>
              <a href="mailto:hello@betterweb.dev" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-tight">
                hello@betterweb.dev
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Giant Watermark Text ── */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none" style={{ height: "clamp(120px, 18vw, 240px)" }}>
        <h1
          className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap uppercase leading-none font-black select-none pointer-events-none"
          style={{
            fontSize: "clamp(100px, 16vw, 300px)",
            color: "rgba(163, 230, 53, 0.05)", // Faded Primary Lime Green
            fontFamily: "'Oswald', 'Arial Black', sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          BetterWeb
        </h1>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="container mx-auto px-6 py-8 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium">
          {currentYear} © BetterWeb. All Rights Reserved.
        </p>
        <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium">
          Premium Digital Agency Studio
        </p>
      </div>
    </footer>
  );
};

export default Footer;
