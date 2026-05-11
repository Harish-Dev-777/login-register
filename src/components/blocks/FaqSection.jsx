import React, { useState } from "react";
import { Plus } from "lucide-react";

const FAQ_DATA = [
  {
    question: "What services do you actually provide?",
    answer:
      "We specialize in end-to-end digital solutions including high-performance Web Development, cross-platform App Development, and data-driven SEO Optimization to accelerate your business growth.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity. A standard web application might take 4-8 weeks, while comprehensive mobile apps or complex platforms can take 3-6 months. We provide clear roadmaps during our initial consultation.",
  },
  {
    question: "Do you design from scratch or use templates?",
    answer:
      "Everything we build is bespoke. We design custom interfaces tailored specifically to your brand's aesthetic and target audience, ensuring a completely unique and premium digital presence.",
  },
  {
    question: "How do you handle SEO? Is it included?",
    answer:
      "Basic technical SEO is built into every website we develop. For aggressive organic growth, we offer comprehensive SEO retainers that cover content strategy, backlink acquisition, and continuous technical audits.",
  },
  {
    question: "Will my website be mobile-friendly?",
    answer:
      "Absolutely. We employ a mobile-first design philosophy. Every project is rigorously tested across all devices and screen sizes to ensure a flawless, responsive user experience.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We leverage the modern web stack to guarantee performance and scalability. Our go-to technologies include React, Next.js, Tailwind CSS, Node.js, and React Native for mobile applications.",
  },
  {
    question: "Do you provide maintenance after launch?",
    answer:
      "Yes. We offer dedicated support and maintenance packages to keep your software updated, secure, and running at peak performance long after the initial launch.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "Pricing depends on the scope, features, and timeline of the project. We offer transparent, milestone-based pricing and will provide a detailed proposal after understanding your specific requirements.",
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/5 last:border-0 group">
      <button
        className="w-full py-6 flex items-center justify-between gap-4 text-left focus:outline-none"
        onClick={onClick}
      >
        <span
          className={`text-lg md:text-xl font-heading uppercase tracking-wide transition-colors duration-300 ${
            isOpen
              ? "text-primary"
              : "text-foreground group-hover:text-primary/70"
          }`}
        >
          {question}
        </span>
        <div
          className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-300 ${
            isOpen
              ? "bg-primary border-primary text-black rotate-45"
              : "bg-white/5 border-white/10 text-white group-hover:border-primary/50 group-hover:text-primary"
          }`}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pb-6"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground leading-relaxed font-sans pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <section className="w-full bg-background py-24 relative">
      {/* Decorative background glow container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Header Section */}
          <div className="lg:w-1/3 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary" />
              <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase font-heading">
                Client Queries
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight font-heading uppercase">
              Frequently <br />
              Asked{" "}
              <span className="text-primary neon-text-glow">Questions</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 font-sans">
              Everything you need to know about our services, process, and how
              we deliver exceptional results for our clients.
            </p>
          </div>

          {/* Accordion List */}
          <div className="lg:w-2/3 w-full bg-black/40 border border-white/5 backdrop-blur-md p-6 md:p-10 rounded-2xl">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={index === openIndex}
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
