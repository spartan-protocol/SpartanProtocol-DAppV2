import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultValue = false

const queries = {
  xs: '(max-width: 480px)', // use max here for default/smallest
  sm: '(min-width: 481px)', // use min for rest
  md: '(min-width: 769px)', // use min for rest
  lg: '(min-width: 1024px)', // use min for rest
  xl: '(min-width: 1200px)', // use min for rest
}

const BreakpointContext = createContext(defaultValue)

const BreakpointProvider = ({ children }) => {
  const [queryMatch, setQueryMatch] = useState({})

  useEffect(() => {
    const mediaQueryLists = {}
    const keys = Object.keys(queries)
    let isAttached = false

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc, media) => {
        acc[media] = !!(
          mediaQueryLists[media] && mediaQueryLists[media].matches
        )
        return acc
      }, {})
      setQueryMatch(updatedMatches)
    }

    if (window && window.matchMedia) {
      const matches = {}
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media] = window.matchMedia(queries[media])
          matches[media] = mediaQueryLists[media].matches
        } else {
          matches[media] = false
        }
      })
      setQueryMatch(matches)
      isAttached = true
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media].addListener(handleQueryListener)
        }
      })
    }

    return () => {
      if (isAttached) {
        keys.forEach((media) => {
          if (typeof queries[media] === 'string') {
            mediaQueryLists[media].removeListener(handleQueryListener)
          }
        })
      }
    }
  }, [])

  return (
    <BreakpointContext.Provider value={queryMatch}>
      {children}
    </BreakpointContext.Provider>
  )
}

function useBreakpoint() {
  const context = useContext(BreakpointContext)
  if (!context) {
    throw new Error('useBreakpoint must be used within BreakpointProvider')
  }
  return context
}
export { useBreakpoint, BreakpointProvider }
