'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  selected: Date | null
  onSelect: (date: Date | null) => void
  className?: string
  minDate?: Date
  disabledDates?: Date[]
}

export function DatePicker({ selected, onSelect, className, minDate, disabledDates = [] }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())
  const [isOpen, setIsOpen] = React.useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const paddingDays = Array(startDay).fill(null)

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, minDate)) return true
    if (disabledDates.some(d => isSameDay(d, date))) return true
    return false
  }

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelect(date)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? format(selected, 'MMMM d, yyyy') : 'Select date'}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-background border rounded-lg shadow-lg w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="p-1 hover:bg-accent rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="p-1 hover:bg-accent rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} className="w-8 h-8" />
            ))}
            {days.map(day => {
              const isDisabled = isDateDisabled(day)
              const isSelected = selected && isSameDay(day, selected)
              const isTodayDate = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    handleDateClick(day)
                    if (selected && !isSameDay(day, selected)) {
                      // Keep picker open for range selection
                    } else {
                      setIsOpen(false)
                    }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    'w-8 h-8 text-sm rounded-md transition-colors',
                    !isSameMonth(day, currentMonth) && 'text-muted-foreground',
                    isDisabled && 'text-muted-foreground/50 cursor-not-allowed',
                    !isDisabled && 'hover:bg-accent',
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    isTodayDate && !isSelected && 'border border-primary'
                  )}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  className?: string
  minDate?: Date
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  className,
  minDate 
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = React.useState(false)
  const [showEndPicker, setShowEndPicker] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const renderCalendar = (
    isStart: boolean,
    isOpen: boolean,
    onClose: () => void,
    selectedDate: Date | null,
    onSelect: (date: Date | null) => void
  ) => {
    if (!isOpen) return null

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startDay = monthStart.getDay()
    const paddingDays = Array(startDay).fill(null)

    const isDateDisabled = (date: Date) => {
      if (minDate && isBefore(date, minDate)) return true
      if (isStart && endDate && isBefore(date, endDate)) return false // Allow any start date
      if (!isStart && startDate && isBefore(date, startDate)) return true
      return false
    }

    return (
      <div className="absolute z-50 mt-2 p-4 bg-background border rounded-lg shadow-lg w-[300px]">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 hover:bg-accent rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 hover:bg-accent rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="w-8 h-8" />
          ))}
          {days.map(day => {
            const isDisabled = isDateDisabled(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)
            const isInRange = startDate && endDate && 
              (isBefore(startDate, day) || isSameDay(startDate, day)) && 
              (isBefore(day, endDate) || isSameDay(day, endDate))

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => {
                  onSelect(day)
                  onClose()
                }}
                disabled={isDisabled}
                className={cn(
                  'w-8 h-8 text-sm rounded-md transition-colors',
                  !isSameMonth(day, currentMonth) && 'text-muted-foreground',
                  isDisabled && 'text-muted-foreground/50 cursor-not-allowed',
                  !isDisabled && 'hover:bg-accent',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  isInRange && !isSelected && 'bg-primary/20',
                  isTodayDate && !isSelected && 'border border-primary'
                )}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative flex gap-4', className)}>
      <div className="relative flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Start Date
        </label>
        <button
          type="button"
          onClick={() => {
            setShowStartPicker(!showStartPicker)
            setShowEndPicker(false)
          }}
          className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background hover:bg-accent"
        >
          <span className={startDate ? 'text-foreground' : 'text-muted-foreground'}>
            {startDate ? format(startDate, 'MMM d, yyyy') : 'Select start date'}
          </span>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </button>
        {renderCalendar(true, showStartPicker, () => setShowStartPicker(false), startDate, onStartDateChange)}
      </div>

      <div className="relative flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          End Date (optional)
        </label>
        <button
          type="button"
          onClick={() => {
            setShowEndPicker(!showEndPicker)
            setShowStartPicker(false)
          }}
          className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background hover:bg-accent"
        >
          <span className={endDate ? 'text-foreground' : 'text-muted-foreground'}>
            {endDate ? format(endDate, 'MMM d, yyyy') : 'Select end date'}
          </span>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </button>
        {renderCalendar(false, showEndPicker, () => setShowEndPicker(false), endDate, onEndDateChange)}
      </div>
    </div>
  )
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
