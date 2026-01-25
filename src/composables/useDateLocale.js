import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDistanceToNow, format } from 'date-fns'
import {
  enUS,
  es,
  de,
  fr,
  ja,
  ru,
  zhCN,
  ar,
  hi,
  ptBR
} from 'date-fns/locale'

/**
 * Composable for dynamic locale-aware date formatting
 * Maps vue-i18n locales to date-fns locales for consistent formatting
 * 
 * @returns {Object} - Reactive date formatting utilities
 */
export function useDateLocale() {
  const { locale } = useI18n()

  // Map i18n locale codes to date-fns locale objects
  const localeMap = {
    en: enUS,
    es: es,
    de: de,
    fr: fr,
    ja: ja,
    ru: ru,
    zh: zhCN,
    ar: ar,
    hi: hi,
    pt_br: ptBR
  }

  /**
   * Get the current date-fns locale based on i18n settings
   */
  const currentLocale = computed(() => {
    return localeMap[locale.value] || enUS
  })

  /**
   * Format a date relative to now (e.g., "2 hours ago", "hace 2 horas")
   * @param {Date|string|number} date - The date to format
   * @param {Object} options - Additional options for formatDistanceToNow
   * @returns {string} - Formatted relative time string
   */
  const formatRelativeTime = (date, options = {}) => {
    if (!date) return ''
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check for invalid date
    if (isNaN(dateObj.getTime())) return ''
    
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: currentLocale.value,
      ...options
    })
  }

  /**
   * Format a date with a specific pattern
   * @param {Date|string|number} date - The date to format
   * @param {string} pattern - The date-fns format pattern (default: 'PPpp')
   * @param {Object} options - Additional options for format
   * @returns {string} - Formatted date string
   */
  const formatDate = (date, pattern = 'PPpp', options = {}) => {
    if (!date) return ''
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check for invalid date
    if (isNaN(dateObj.getTime())) return ''
    
    return format(dateObj, pattern, {
      locale: currentLocale.value,
      ...options
    })
  }

  /**
   * Format a date in short format (e.g., "Jan 25, 2026")
   * @param {Date|string|number} date - The date to format
   * @returns {string} - Formatted short date string
   */
  const formatShortDate = (date) => {
    return formatDate(date, 'PP')
  }

  /**
   * Format a date in long format with time (e.g., "January 25, 2026 at 3:45 PM")
   * @param {Date|string|number} date - The date to format
   * @returns {string} - Formatted long date string with time
   */
  const formatLongDateTime = (date) => {
    return formatDate(date, 'PPPp')
  }

  /**
   * Format time only (e.g., "3:45 PM")
   * @param {Date|string|number} date - The date to format
   * @returns {string} - Formatted time string
   */
  const formatTime = (date) => {
    return formatDate(date, 'p')
  }

  return {
    currentLocale,
    formatRelativeTime,
    formatDate,
    formatShortDate,
    formatLongDateTime,
    formatTime
  }
}
