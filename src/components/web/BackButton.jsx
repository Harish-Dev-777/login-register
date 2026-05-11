import React from "react"
import { ArrowLeft } from "lucide-react"

const BackButton = ({ onClick }) => {
  return (
    <div className="fixed top-8 left-8 z-50">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-primary transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </div>
        <span className="hidden sm:block">Go Back</span>
      </button>
    </div>
  )
}

export default BackButton
