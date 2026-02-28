'use client';

import * as React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';

type CalendarValue = Date | null;

interface CalendarProps {
  value?: CalendarValue;
  onChange?: (date: Date) => void;
}

export function Calendar({ value, onChange }: CalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<CalendarValue>(value || null);

  const handleChange = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {formatDate(selectedDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2">
          <ReactCalendar
            onChange={(value) => {
              // react-calendar can return a Date or null
              if (value instanceof Date) {
                handleChange(value);
              }
            }}
            value={selectedDate || new Date()}
            className="w-full border-none rounded-md"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}