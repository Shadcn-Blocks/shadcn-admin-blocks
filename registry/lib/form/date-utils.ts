import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { z } from 'zod'

// Extend dayjs with plugins
dayjs.extend(relativeTime)

// Date formatting utilities
export const dateFormats = {
  // Common display formats
  display: 'MMM D, YYYY',
  displayWithTime: 'MMM D, YYYY h:mm A',
  short: 'MM/DD/YYYY',
  iso: 'YYYY-MM-DD',
  time: 'HH:mm',

  // API formats
  api: 'YYYY-MM-DD',
  apiWithTime: 'YYYY-MM-DDTHH:mm:ss',

  // date-fns compatibility formats
  PPP: 'MMM D, YYYY', // Long localized date format
} as const

// Date conversion utilities
export const dateUtils = {
  /**
   * Format a date for display
   * Supports both dayjs and date-fns format patterns for compatibility
   */
  formatForDisplay: (date: string | Date | dayjs.Dayjs, format: string = dateFormats.display) => {
    // Map common date-fns patterns to dayjs equivalents
    const formatMap: Record<string, string> = {
      PPP: dateFormats.PPP,
      PP: 'MMM D, YYYY',
      P: 'MM/DD/YYYY',
    }

    const dayJsFormat = formatMap[format] || format
    return dayjs(date).format(dayJsFormat)
  },

  /**
   * Format a date for HTML input (YYYY-MM-DD)
   */
  formatForInput: (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).format(dateFormats.iso)
  },

  /**
   * Format a date for API submission
   */
  formatForAPI: (date: string | Date | dayjs.Dayjs, includeTime = false) => {
    const format = includeTime ? dateFormats.apiWithTime : dateFormats.api
    return dayjs(date).format(format)
  },

  /**
   * Parse a date from HTML input
   */
  parseFromInput: (dateString: string) => {
    return dayjs(dateString, dateFormats.iso)
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime: (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).fromNow()
  },

  /**
   * Check if a date is valid
   */
  isValid: (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).isValid()
  },

  /**
   * Get today's date in input format
   */
  today: () => {
    return dayjs().format(dateFormats.iso)
  },

  /**
   * Get a date N days from now
   */
  addDays: (days: number, from?: string | Date | dayjs.Dayjs) => {
    const baseDate = from ? dayjs(from) : dayjs()
    return baseDate.add(days, 'day').format(dateFormats.iso)
  },

  /**
   * Get age from birth date
   */
  getAge: (birthDate: string | Date | dayjs.Dayjs) => {
    return dayjs().diff(dayjs(birthDate), 'year')
  },
}

// Zod schema helpers for date validation
export const dateSchemas = {
  /**
   * Basic date string validation
   */
  dateString: () =>
    z.string().refine((date) => dateUtils.isValid(date), { message: 'Please enter a valid date' }),

  /**
   * Date with minimum age requirement
   */
  minimumAge: (minAge: number) =>
    z.string().refine(
      (date) => {
        if (!dateUtils.isValid(date)) return false
        return dateUtils.getAge(date) >= minAge
      },
      { message: `You must be at least ${minAge} years old` }
    ),

  /**
   * Date within a specific range
   */
  dateRange: (minDate?: string, maxDate?: string) =>
    z.string().refine(
      (date) => {
        if (!dateUtils.isValid(date)) return false
        const d = dayjs(date)

        if (minDate && d.isBefore(dayjs(minDate))) return false
        if (maxDate && d.isAfter(dayjs(maxDate))) return false

        return true
      },
      {
        message: `Date must be ${minDate ? `after ${dateUtils.formatForDisplay(minDate)}` : ''}${minDate && maxDate ? ' and ' : ''}${maxDate ? `before ${dateUtils.formatForDisplay(maxDate)}` : ''}`,
      }
    ),

  /**
   * Future date only
   */
  futureDate: () =>
    z.string().refine(
      (date) => {
        if (!dateUtils.isValid(date)) return false
        return dayjs(date).isAfter(dayjs(), 'day')
      },
      { message: 'Date must be in the future' }
    ),

  /**
   * Past date only
   */
  pastDate: () =>
    z.string().refine(
      (date) => {
        if (!dateUtils.isValid(date)) return false
        return dayjs(date).isBefore(dayjs(), 'day')
      },
      { message: 'Date must be in the past' }
    ),

  /**
   * Business days only (Monday-Friday)
   */
  businessDay: () =>
    z.string().refine(
      (date) => {
        if (!dateUtils.isValid(date)) return false
        const day = dayjs(date).day()
        return day >= 1 && day <= 5
      },
      { message: 'Please select a business day (Monday-Friday)' }
    ),
}

// Common date presets for forms
export const datePresets = {
  today: dateUtils.today(),
  tomorrow: dateUtils.addDays(1),
  nextWeek: dateUtils.addDays(7),
  nextMonth: dayjs().add(1, 'month').format(dateFormats.iso),

  // For age restrictions
  eighteenYearsAgo: dayjs().subtract(18, 'year').format(dateFormats.iso),
  sixtyFiveYearsAgo: dayjs().subtract(65, 'year').format(dateFormats.iso),

  // Common business dates
  endOfYear: dayjs().endOf('year').format(dateFormats.iso),
  startOfYear: dayjs().startOf('year').format(dateFormats.iso),
}
