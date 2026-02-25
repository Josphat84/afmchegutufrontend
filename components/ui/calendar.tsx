//Calendar component
// frontend/components/ui/calendar.tsx

'use client';

import * as React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function Calendar({ value, onChange }: CalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value || null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedDate ? selectedDate.toDateString() : 'Select date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <ReactCalendar
          onChange={(date: Date) => {
            setSelectedDate(date);
            onChange?.(date);
            setOpen(false);
          }}
          value={selectedDate || new Date()}
          className="w-full border-none"
        />
      </PopoverContent>
    </Popover>
  );
}