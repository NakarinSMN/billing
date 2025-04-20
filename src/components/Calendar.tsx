"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const days: Date[] = [];
    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push(
        new Date(firstDay.getFullYear(), firstDay.getMonth(), 1 - i)
      );
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), d));
    }

    while (days.length < 42) {
      const last = days[days.length - 1];
      days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }

    setDaysInMonth(days);
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const isHoliday = (date: Date) =>
    holidays.includes(date.toISOString().split('T')[0]);

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
    <div className={`w-full max-w-lg mx-auto p-4 bg-card text-card-foreground rounded-lg ${className}`}> {/* widened container */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="form-button p-2"
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <div className="flex items-center space-x-2 relative">
          <div className="relative" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="form-button py-1 px-2 inline-flex items-center min-w-[90px] justify-between"
            >
              {months[currentDate.getMonth()]} <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isMonthOpen && (
              <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-md rounded-md mt-1 w-32">
                {months.map((name, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentDate(new Date(currentDate.getFullYear(), idx, 1));
                      setIsMonthOpen(false);
                    }}
                    className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="form-button py-1 px-2 inline-flex items-center min-w-[80px] justify-between"
            >
              {currentDate.getFullYear()} <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isYearOpen && (
              <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-md rounded-md mt-1 w-24 max-h-60 overflow-y-auto">
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    onClick={() => {
                      setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                      setIsYearOpen(false);
                    }}
                    className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={nextMonth}
          className="form-button p-2"
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-medium border-b border-border pb-2 mb-2 text-muted-foreground">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 min-h-[21rem]">
        {daysInMonth.map((day, idx) => {
          const iso = day.toISOString().split('T')[0];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate === iso;
          const isToday = day.toDateString() === todayString;
          const holiday = isHoliday(day);

          let bgClass = '';
          let textClass = '';

          if (!isCurrentMonth) {
            textClass = 'text-muted-foreground';
          } else if (holiday) {
            bgClass = 'bg-destructive';
            textClass = 'text-destructive-foreground';
          } else if (isSelected) {
            bgClass = 'bg-primary';
            textClass = 'text-primary-foreground';
          } else if (isToday) {
            bgClass = 'bg-secondary';
            textClass = 'text-secondary-foreground';
          } else {
            textClass = 'text-foreground';
          }

          return (
            <div
              key={idx}
              onClick={() => isCurrentMonth && handleSelectDate(day)}
              className={`p-2 rounded-md text-sm cursor-pointer transition-all hover:scale-105 ${bgClass} ${textClass}`}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
