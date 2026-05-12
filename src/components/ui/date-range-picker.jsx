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

  const displayText = value?.start ? formatRange(value.start, value.end) : "";

  return (
    <div ref={ref} className={clsx("relative inline-block", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 h-10 px-3 text-sm border border-white/10 bg-background rounded-none transition-all duration-200",
          "hover:border-primary/50 focus:border-primary/50 focus:outline-none",
          isOpen && "border-primary/50",
          displayText ? "text-white" : "text-gray-500"
        )}
      >
        <CalendarIcon />
        <span className="truncate min-w-[120px] text-left">
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
        <div className="absolute top-12 right-0 z-50 glass-card border border-white/10 rounded-none shadow-2xl shadow-black/50 flex animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Presets */}
          <div className="w-40 border-r border-white/10 p-2 flex flex-col gap-0.5">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-2 py-1.5">Quick Select</p>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset)}
                className={clsx(
                  "text-left text-xs px-2 py-1.5 rounded-sm transition-all duration-150",
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

          {/* Calendar */}
          <div className="p-3 w-[260px]">
            {/* Month nav */}
            <div className="flex justify-between items-center mb-3">
              <button type="button" onClick={prevMonth} className="p-1 text-gray-500 hover:text-primary transition-colors">
                <ChevronLeftIcon />
              </button>
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button type="button" onClick={nextMonth} className="p-1 text-gray-500 hover:text-primary transition-colors">
                <ChevronRightIcon />
              </button>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};
