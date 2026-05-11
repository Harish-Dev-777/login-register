import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    name: "Alex Rivera",
    username: "CEO at TechFlow",
    body: "The AI-driven workflows BetterWeb implemented for our platform reduced our operational costs by 40%. Their technical expertise is unmatched.",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sarah Chen",
    username: "Marketing Director @ Lumina",
    body: "I've worked with many agencies, but none have the eye for detail that BetterWeb has. Our conversion rate increased by 2.5x in just three months.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "James Wilson",
    username: "Founder of PeakSaaS",
    body: "The speed at which they delivered a complex AI integration was staggering. They don't just build websites; they build competitive advantages.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Elena Rodriguez",
    username: "Product Lead at Nexus",
    body: "Their minimalist design approach combined with robust backend architecture is exactly what we needed for our scale-up phase.",
    img: "https://avatar.vercel.sh/elena",
  },
  {
    name: "David Park",
    username: "CTO at InnovateAI",
    body: "BetterWeb is our go-to partner for all things frontend. Their clean code and attention to performance made our app feel 10x faster.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Monica Geller",
    username: "Creative Head @ Visionary",
    body: "The aesthetics are simply world-class. They managed to capture our brand essence perfectly while keeping the UX incredibly intuitive.",
    img: "https://avatar.vercel.sh/monica",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden p-6 rounded-sm border transition-all duration-300",
        // light styles
        "border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30",
      )}
    >
      <div className="flex flex-row items-center gap-3 mb-4">
        <img className="rounded-full w-10 h-10 border border-white/10" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-white font-heading uppercase tracking-tight">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-primary/80 uppercase tracking-widest">{username}</p>
        </div>
      </div>
      <blockquote className="text-sm leading-relaxed text-white/60 font-sans italic">
        "{body}"
      </blockquote>
    </figure>
  );
};

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative w-full py-24 bg-background overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 mb-16 relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-primary" />
          <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase font-heading">
            Wall of Love
          </span>
          <div className="h-px w-10 bg-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight font-heading uppercase">
          Trusted by <span className="text-primary ">Industry Leaders</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
          Don't just take our word for it. Here's what our global clients have to say about their experience with BetterWeb.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:30s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:35s] mt-4">
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        
        {/* Fading Edges Overlay */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
