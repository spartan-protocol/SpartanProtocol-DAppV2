import { useRef, useEffect } from 'react'

// Get previous state
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Check URL for 404
export const checkValidURL = (url) => {
  const http = new XMLHttpRequest()
  http.open('HEAD', url, false)
  http.send()
  if (http.status !== 404) return true
  return false
}

// Check if device is iOS
export const isAppleDevice = () =>
  [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document)

export const formatDate = (unixTime) => {
  const date = new Date(unixTime * 1000)
  return date.toLocaleDateString()
}

export const getUnixStartOfDay = () => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const timestamp = startOfDay / 1000
  return timestamp
}

/**
 * Check the status of a Promise.allSettled() item and return value or error message
 * @returns {uint} contract
 */
export const checkResolved = (settledItem, errorMsg) => {
  if (settledItem.status === 'fulfilled') {
    return settledItem.value
  }
  return errorMsg
}
