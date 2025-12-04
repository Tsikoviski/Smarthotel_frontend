// Currency detection and conversion utility

const CURRENCY_CONFIG = {
  GH: { code: 'GHS', symbol: 'GH₵', rate: 1, name: 'Ghanaian Cedi' },
  NG: { code: 'NGN', symbol: '₦', rate: 250, name: 'Nigerian Naira' },
  US: { code: 'USD', symbol: '$', rate: 0.08, name: 'US Dollar' },
  GB: { code: 'GBP', symbol: '£', rate: 0.06, name: 'British Pound' },
  DEFAULT: { code: 'GHS', symbol: 'GH₵', rate: 1, name: 'Ghanaian Cedi' }
}

let detectedCurrency = null

// Detect user's country and set currency
export async function detectCurrency() {
  if (detectedCurrency) return detectedCurrency

  try {
    // Try to get from localStorage first
    const saved = localStorage.getItem('userCurrency')
    if (saved) {
      detectedCurrency = JSON.parse(saved)
      return detectedCurrency
    }

    // Detect from IP geolocation
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    const countryCode = data.country_code

    const currency = CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG.DEFAULT
    detectedCurrency = currency
    localStorage.setItem('userCurrency', JSON.stringify(currency))
    
    return currency
  } catch (error) {
    console.error('Currency detection failed:', error)
    detectedCurrency = CURRENCY_CONFIG.DEFAULT
    return detectedCurrency
  }
}

// Convert price from GHS to detected currency
export function convertPrice(ghsPrice) {
  if (!detectedCurrency) {
    return { amount: ghsPrice, ...CURRENCY_CONFIG.DEFAULT }
  }
  
  const amount = Math.round(ghsPrice * detectedCurrency.rate)
  return { amount, ...detectedCurrency }
}

// Format price with currency symbol
export function formatPrice(ghsPrice) {
  const { amount, symbol } = convertPrice(ghsPrice)
  return `${symbol} ${amount.toLocaleString()}`
}

// Get current currency
export function getCurrentCurrency() {
  return detectedCurrency || CURRENCY_CONFIG.DEFAULT
}

// Manually set currency
export function setCurrency(countryCode) {
  const currency = CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG.DEFAULT
  detectedCurrency = currency
  localStorage.setItem('userCurrency', JSON.stringify(currency))
  return currency
}

// Get all available currencies
export function getAvailableCurrencies() {
  return Object.entries(CURRENCY_CONFIG)
    .filter(([key]) => key !== 'DEFAULT')
    .map(([key, value]) => ({ code: key, ...value }))
}
