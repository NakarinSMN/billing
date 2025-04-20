"use client";

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react';

const holidays = [
  '2024-01-01',
  '2024-04-13',
  '2024-04-14',
  '2024-04-15',
  '2024-12-05',
  '2024-12-31',
];

export default function Calendar({
  selectedDate,
  onSelectDate,
  className = "",
}: {
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  className?: string;
}) {
  // Initialize view month from selectedDate or today
  const [currentDate, setCurrentDate] = useState<Date>(() =>
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Regenerate calendar grid when currentDate changes
  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  // Generate array of dates for calendar grid
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: Date[] = [];
    // Prepend previous month's trailing days
    for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }
    // Add current month's days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    // Append next month's leading days to fill grid
    while (days.length < 42) {
      const last = days[days.length - 1];
      days.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      );
    }

    setDaysInMonth(days);
  };

  // Change month while keeping the same day index
  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth() + offset;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const day = Math.min(prev.getDate(), lastDay);
      return new Date(year, month, day);
    });
  };

  // Change year while keeping the same month/day index
  const changeYear = (offset: number) => {
    setCurrentDate(prev => {
      const year = prev.getFullYear() + offset;
      const month = prev.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const day = Math.min(prev.getDate(), lastDay);
      return new Date(year, month, day);
    });
  };

  const prevYear = () => changeYear(-1);
  const prevMonth = () => changeMonth(-1);
  const nextMonth = () => changeMonth(1);
  const nextYear = () => changeYear(1);

  const isHoliday = (date: Date) =>
    holidays.includes(date.toISOString().split('T')[0]);

  // Handle date selection: notify parent only
  const handleSelectDate = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date.toISOString().split('T')[0]);
    }
  };

  const todayString = new Date().toDateString();
  const yearOptions = Array.from({ length: 21 }, (_, i) => 2015 + i);
  const months = Array.from({ length: 12 }).map((_, idx) =>
    new Date(0, idx).toLocaleString('th-TH', { month: 'long' })
  );

  return (
    <div
      className={`w-full max-w-[500px] p-4 overflow-x-hidden bg-card text-card-foreground rounded-lg ${className}`}
    >
      {/* Header: year/month controls */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevYear} aria-label="Previous year">
          <ChevronsLeft className="w-5 h-5 text-primary" />
        </button>
        <button onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex items-center space-x-2 relative">
          {/* Month dropdown toggle without background */}
          <div className="relative" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="py-1 px-2 w-28 flex items-center justify-center"
            >
              <span className="text-foreground">{months[currentDate.getMonth()]}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-primary" />
            </button>
            {isMonthOpen && (
              <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-md rounded-md mt-1 w-32">
                {months.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentDate(
                        new Date(
                          currentDate.getFullYear(),
                          idx,
                          Math.min(
                            currentDate.getDate(),
                            new Date(currentDate.getFullYear(), idx + 1, 0).getDate()
                          )
                        )
                      );
                      setIsMonthOpen(false);
                    }}
                    className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Year dropdown toggle without background */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="py-1 px-2 w-20 flex items-center justify-center"
            >
              <span className="text-foreground">{currentDate.getFullYear()}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-primary" />
            </button>
            {isYearOpen && (
              <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-md rounded-md mt-1 w-24 max-h-60 overflow-y-auto">
                {yearOptions.map(y => (
                  <div
                    key={y}
                    onClick={() => {
                      setCurrentDate(
                        new Date(
                          y,
                          currentDate.getMonth(),
                          Math.min(
                            currentDate.getDate(),
                            new Date(y, currentDate.getMonth() + 1, 0).getDate()
                          )
                        )
                      );
                      setIsYearOpen(false);
                    }}
                    className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={nextMonth} aria-label="Next month">
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
        <button onClick={nextYear} aria-label="Next year">
          <ChevronsRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center font-medium border-b border-border pb-2 mb-2 text-muted-foreground">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 min-h-[21rem]">
        {daysInMonth.map((date, idx) => {
          const iso = date.toISOString().split('T')[0];
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate === iso;
          const isToday = date.toDateString() === todayString;
          const isHol = isHoliday(date);

          const bg = !isCurrentMonth
            ? ''
            : isHol
              ? 'bg-destructive'
              : isSelected
                ? 'bg-primary'
                : isToday
                  ? 'bg-secondary'
                  : '';
          const txt = !isCurrentMonth
            ? 'text-muted-foreground'
            : isHol
              ? 'text-destructive-foreground'
              : isSelected
                ? 'text-primary-foreground'
                : isToday
                  ? 'text-secondary-foreground'
                  : 'text-foreground';

          const classes = [
            'p-2 rounded-md text-sm',
            bg,
            txt,
            isCurrentMonth
              ? 'cursor-pointer transition-all hover:scale-105'
              : 'cursor-default',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={idx}
              onClick={isCurrentMonth ? () => handleSelectDate(date) : undefined}
              className={classes}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
