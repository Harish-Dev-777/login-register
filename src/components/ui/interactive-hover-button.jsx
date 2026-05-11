import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "group bg-background relative w-full sm:w-auto cursor-pointer overflow-hidden rounded-full border py-4 px-12 text-center font-semibold whitespace-nowrap",
        className
      )}
      {...props}>
      <div className="flex items-center justify-center gap-2">
        <div
          className="bg-primary h-2 w-2 shrink-0 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span
          className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div
        className="text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
}
