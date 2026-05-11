import React from "react"
import { GlowCard } from "@/components/ui/spotlight-card"
import { Monitor, Search, Smartphone, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    title: "Web Development",
    description: "Building high-performance, scalable websites using modern technologies like React, Next.js, and Node.js. Optimized for speed, accessibility, and conversion-driven design.",
    icon: Monitor,
    tags: ["React", "Next.js", "Tailwind"]
  },
  {
    title: "App Development",
    description: "Creating intuitive and powerful mobile applications for iOS and Android. Native performance with cross-platform efficiency using React Native and Flutter.",
    icon: Smartphone,
    tags: ["iOS", "Android", "React Native"]
  },
  {
    title: "SEO Optimization",
    description: "Driving organic growth through technical SEO audits, content strategy, and data-driven insights to ensure your brand ranks where it matters most.",
    icon: Search,
    tags: ["Strategy", "Analytics", "Growth"]
  }
]

const ServicesSection = () => {
  return (
    <section id="services" className="w-full bg-background py-24 relative overflow-hidden border-t border-border/30">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase font-heading">
              What We Do
            </span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight font-heading uppercase">
            Our <span className="text-primary neon-text-glow">Expertise</span>
          </h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We deliver state-of-the-art digital solutions tailored to your business needs, ensuring maximum impact and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            return (
              <GlowCard 
                key={index} 
                glowColor="lime"
                customSize={true}
                className="w-full min-h-[420px] group text-left"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-10">
                    <div className="w-16 h-16 bg-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500">
                      <Icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black font-heading uppercase text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-widest font-bold text-primary/70 bg-primary/5 px-2 py-1 border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 text-foreground font-semibold group/btn w-fit hover:text-primary transition-colors">
                    Learn More 
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </GlowCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
