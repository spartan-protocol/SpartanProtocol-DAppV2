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
  const now = new Date().getTime()
  const startOfDay = now - (now % 86400000)
  const timestamp = startOfDay / 1000
  return timestamp
}

export const getUnixEndOfDay = () => {
  const now = new Date().getTime()
  const startOfDay = now - (now % 86400000)
  const endOfDay = startOfDay + 86400000
  const timestamp = endOfDay / 1000
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

/**
 * An alternative to html/css anchor / jump links
 * Using this instead of standard href="#ID" jump links means you can avoid the css-grid breaking behavior by setting a parent element
 * Another advantage is that it uses smooth scrolling behaviour instead of an instant-jump
 * @param targetEl ie. if a target element's ID is #first use "first" as the string
 * @param parentEl enter null if you dont care about css-grid breaking, otherwise enter the element ID of a parent element
 */
export const anchorLink = (targetEl: string, parentEl: string = '') => {
  const target = document.getElementById(targetEl)
  if (target) {
    const parent = document.getElementById(parentEl)
    if (parentEl !== '' && parent) {
      parent.scrollTo({ behavior: 'smooth', top: target.offsetTop })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
