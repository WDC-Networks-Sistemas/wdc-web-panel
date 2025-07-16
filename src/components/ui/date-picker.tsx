'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { DateRange } from '@/features/orders/types/orders'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  initialDateRange?: DateRange
  onDateRangeChange: (dateRange: DateRange) => void
}

export function DatePicker({
  initialDateRange,
  onDateRangeChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange>(initialDateRange || {
    from: undefined,
    to: undefined,
  })

  // Update the parent component when the date range changes
  React.useEffect(() => {
    if (date !== initialDateRange) {
      onDateRangeChange(date)
    }
  }, [date, initialDateRange, onDateRangeChange])

  return (
    <div className="grid gap-2">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        locale={ptBR}
      />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date()
            const twoWeeksAgo = new Date(today)
            twoWeeksAgo.setDate(today.getDate() - 15)
            setDate({
              from: twoWeeksAgo,
              to: today,
            })
          }}
        >
          Últimos 15 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date()
            const thirtyDaysAgo = new Date(today)
            thirtyDaysAgo.setDate(today.getDate() - 30)
            setDate({
              from: thirtyDaysAgo,
              to: today,
            })
          }}
        >
          Últimos 30 dias
        </Button>
      </div>
    </div>
  )
}

interface DateRangePickerProps {
  dateRange: DateRange
  onChange: (dateRange: DateRange) => void
  align?: 'start' | 'center' | 'end'
}

export function DateRangePicker({
  dateRange,
  onChange,
  align = 'start',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const formatDateString = () => {
    if (!dateRange.from && !dateRange.to) return 'Selecione um período'

    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(
        dateRange.to,
        'dd/MM/yyyy'
      )}`
    }

    if (dateRange.from) {
      return `A partir de ${format(dateRange.from, 'dd/MM/yyyy')}`
    }

    if (dateRange.to) {
      return `Até ${format(dateRange.to, 'dd/MM/yyyy')}`
    }

    return 'Selecione um período'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 justify-between"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
            {formatDateString()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        <DatePicker
          initialDateRange={dateRange}
          onDateRangeChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
