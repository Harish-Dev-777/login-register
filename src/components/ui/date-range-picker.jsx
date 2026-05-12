import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  addDays, addMonths, endOfDay, endOfMonth, endOfWeek, format,
  isSameDay, isSameMonth, isToday, isWithinInterval,
  startOfDay, startOfMonth, startOfWeek,
  subDays, subMonths, subWeeks
} from "date-fns";
import clsx from "clsx";

// ── Icons ──
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="12" height="11" rx="1.5" />
    <line x1="2" y1="7" x2="14" y2="7" />
    <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" />
    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Presets ──
const getPresets = () => {
  const now = new Date();
  return [
    { label: "Today", start: startOfDay(now), end: endOfDay(now) },
    { label: "Yesterday", start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) },
    { label: "Last 7 Days", start: startOfDay(subDays(now, 6)), end: endOfDay(now) },
    { label: "Last 14 Days", start: startOfDay(subDays(now, 13)), end: endOfDay(now) },
    { label: "Last 30 Days", start: startOfDay(subDays(now, 29)), end: endOfDay(now) },
    { label: "This Month", start: startOfMonth(now), end: endOfDay(now) },
    { label: "Last Month", start: startOfMonth(subMonths(now, 1)), end: endOfDay(endOfMonth(subMonths(now, 1))) },
    { label: "Last 3 Months", start: startOfDay(subMonths(now, 3)), end: endOfDay(now) },
  ];
};

// ── Format display range ──
const formatRange = (start, end) => {
  if (!start && !end) return "";
  if (start && !end) return format(start, "dd-MMM-yyyy");
  if (start && end && isSameDay(start, end)) return format(start, "dd-MMM-yyyy");
  return `${format(start, "dd MMM")} – ${format(end, "dd MMM yyyy")}`;
};

// ── Component ──
export const DateRangePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const ref = useRef(null);
  const presets = useMemo(() => getPresets(), []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Build days grid
  const days = [];
  let day = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleDayClick = (d) => {
    if (!value?.start || (value.start && value.end)) {
      onChange({ start: startOfDay(d), end: null });
      setHoverDate(d);
      setIsSelecting(true);
    } else if (isSelecting) {
      if (d >= value.start) {
        onChange({ start: value.start, end: endOfDay(d) });
      } else {
        onChange({ start: startOfDay(d), end: endOfDay(value.start) });
      }
      setIsSelecting(false);
      setHoverDate(null);
      setIsOpen(false);
    }
  };

  const handlePreset = (preset) => {
    onChange({ start: preset.start, end: preset.end });
    setIsOpen(false);
    setIsSelecting(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ start: null, end: null });
    setIsSelecting(false);
  };

  const [view, setView] = useState("calendar"); // "calendar", "months", "years"

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - 12 + i);

  const handleMonthChange = (mIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(mIndex);
    setCurrentMonth(newDate);
    setView("calendar");
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setView("calendar");
  };

  const displayText = value?.start ? formatRange(value.start, value.end) : "";

  return (
    <div ref={ref} className={clsx("relative inline-block", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setView("calendar"); }}
        className={clsx(
          "flex items-center gap-2 h-10 px-3 text-sm border border-white/10 bg-background rounded-none transition-all duration-200 w-full",
          "hover:border-primary/50 focus:border-primary/50 focus:outline-none",
          isOpen && "border-primary/50",
          displayText ? "text-white" : "text-gray-500"
        )}
      >
        <CalendarIcon />
        <span className="truncate flex-1 text-left">
          {displayText || "Filter by date"}
        </span>
        {displayText && (
          <span onClick={handleClear} className="text-gray-500 hover:text-red-500 transition-colors ml-1 cursor-pointer">
            <XIcon />
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={clsx(
          "absolute top-12 right-0 z-[60] glass-card border border-white/10 rounded-none shadow-2xl shadow-black/50 flex flex-col md:flex-row animate-in fade-in slide-in-from-top-2 duration-200",
          "w-[calc(100vw-2rem)] sm:w-auto min-w-[280px]"
        )}>
          {/* Presets */}
          <div className="w-full md:w-40 border-b md:border-b-0 md:border-r border-white/10 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible no-scrollbar">
            <p className="hidden md:block text-[10px] uppercase tracking-widest text-gray-500 font-bold px-2 py-1.5">Quick Select</p>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset)}
                className={clsx(
                  "whitespace-nowrap text-left text-xs px-2 py-1.5 rounded-sm transition-all duration-150",
                  value?.start && value?.end &&
                  isSameDay(value.start, preset.start) && isSameDay(value.end, preset.end)
                    ? "bg-primary/20 text-primary font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar & Actions */}
          <div className="flex flex-col flex-1">
            <div className="p-3 w-full sm:w-[280px]">
              {/* Header with Month & Year Toggles */}
              <div className="flex justify-between items-center mb-3 gap-1">
                <button type="button" onClick={prevMonth} className="p-1 text-gray-500 hover:text-primary transition-colors shrink-0">
                  <ChevronLeftIcon />
                </button>
                
                <div className="flex items-center gap-1 flex-1 justify-center">
                  <button 
                    type="button"
                    onClick={() => setView(view === "months" ? "calendar" : "months")}
                    className={clsx(
                      "text-xs font-bold font-heading uppercase tracking-wider px-2 py-1 rounded-sm transition-all",
                      view === "months" ? "bg-primary text-black" : "text-white hover:bg-white/10"
                    )}
                  >
                    {months[currentMonth.getMonth()].slice(0, 3)}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setView(view === "years" ? "calendar" : "years")}
                    className={clsx(
                      "text-xs font-bold font-heading uppercase tracking-wider px-2 py-1 rounded-sm transition-all",
                      view === "years" ? "bg-primary text-black" : "text-white hover:bg-white/10"
                    )}
                  >
                    {currentMonth.getFullYear()}
                  </button>
                </div>

                <button type="button" onClick={nextMonth} className="p-1 text-gray-500 hover:text-primary transition-colors shrink-0">
                  <ChevronRightIcon />
                </button>
              </div>

              {/* View Switcher */}
              {view === "months" && (
                <div className="grid grid-cols-5 gap-1 animate-in fade-in zoom-in-95 duration-200">
                  {months.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => handleMonthChange(i)}
                      className={clsx(
                        "text-[10px] uppercase font-bold py-3 rounded-sm transition-all",
                        currentMonth.getMonth() === i ? "bg-primary text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {view === "years" && (
                <div className="grid grid-cols-5 gap-1 animate-in fade-in zoom-in-95 duration-200">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => handleYearChange(y)}
                      className={clsx(
                        "text-[10px] font-bold py-3 rounded-sm transition-all",
                        currentMonth.getFullYear() === y ? "bg-primary text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}

              {view === "calendar" && (
                <>
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 text-center mb-1">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                      <div key={d} className="text-[10px] uppercase tracking-widest text-gray-600 font-bold py-1">{d}</div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {days.map((d) => {
                      const isStart = value?.start && isSameDay(d, value.start);
                      const isEnd = value?.end && isSameDay(d, value.end);
                      const isHover = hoverDate && isSelecting && isSameDay(d, hoverDate);
                      const inRange =
                        value?.start &&
                        ((value.end && isWithinInterval(d, { start: value.start, end: value.end })) ||
                          (hoverDate && !value.end && (
                            hoverDate >= value.start
                              ? isWithinInterval(d, { start: value.start, end: hoverDate })
                              : isWithinInterval(d, { start: hoverDate, end: value.start })
                          )));

                      return (
                        <div
                          key={d.toString()}
                          className={clsx(
                            "flex items-center justify-center",
                            inRange && !isStart && !isEnd && !isHover && "bg-primary/10"
                          )}
                          onMouseEnter={() => { if (value?.start && !value.end) setHoverDate(d); }}
                          onClick={() => handleDayClick(d)}
                        >
                          <div className={clsx(
                            "w-8 h-8 flex items-center justify-center text-xs cursor-pointer rounded-sm transition-all duration-100",
                            !isSameMonth(d, currentMonth) && "text-gray-700",
                            isSameMonth(d, currentMonth) && !isStart && !isEnd && !isHover && "text-gray-300 hover:bg-white/10 hover:text-white",
                            (isStart || isEnd) && "bg-primary text-black font-bold",
                            isHover && !isStart && "ring-2 ring-primary bg-primary/20 text-primary font-bold",
                            isToday(d) && !isStart && !isEnd && "text-primary font-bold"
                          )}>
                            {format(d, "d")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-white/10 flex justify-end gap-2 bg-black/20">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-primary text-black hover:bg-primary/80 transition-all rounded-sm disabled:opacity-50"
                disabled={!value?.start}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};
