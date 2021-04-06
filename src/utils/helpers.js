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
