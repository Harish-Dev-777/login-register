import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const StatItem = ({ end, suffix, label, duration = 2 }) => {
  const countRef = useRef(null)

  useGSAP(() => {
    const obj = { value: 0 }
    gsap.to(obj, {
      value: end,
      duration: duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: countRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.floor(obj.value)
        }
      }
    })
  }, { scope: countRef })

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center group">
      <div className="flex items-baseline font-heading">
        <span ref={countRef} className="text-6xl md:text-8xl font-black text-white tracking-tighter transition-all duration-500 group-hover:text-primary">
          0
        </span>
        <span className="text-4xl md:text-6xl font-black text-primary ml-1">
          {suffix}
        </span>
      </div>
      <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-gray-500 mt-2 font-heading">
        {label}
      </p>
    </div>
  )
}

const StatsCounter = () => {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
          <StatItem end={50} suffix="+" label="Successful Projects" />
          <StatItem end={99} suffix="%" label="System Uptime" />
          <StatItem end={24} suffix="/7" label="Support Availability" />
        </div>
      </div>
    </div>
  )
}

export default StatsCounter
