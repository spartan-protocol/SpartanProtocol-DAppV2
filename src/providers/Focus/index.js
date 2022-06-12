import React, { useState, useEffect, useContext } from 'react'

const FocusContext = React.createContext(false)

const FocusProvider = (props) => {
  const [windowIsActive, setWindowIsActive] = useState(true)

  function handleActivity(forcedFlag) {
    if (typeof forcedFlag === 'boolean') {
      return forcedFlag ? setWindowIsActive(true) : setWindowIsActive(false)
    }

    return document.hidden ? setWindowIsActive(false) : setWindowIsActive(true)
  }

  useEffect(() => {
    const handleActivityFalse = () => handleActivity(false)
    const handleActivityTrue = () => handleActivity(true)

    document.addEventListener('visibilitychange', handleActivity)
    document.addEventListener('blur', handleActivityFalse)
    window.addEventListener('blur', handleActivityFalse)
    window.addEventListener('focus', handleActivityTrue)
    document.addEventListener('focus', handleActivityTrue)

    return () => {
      document.removeEventListener('visibilitychange', handleActivity)
      document.removeEventListener('blur', handleActivityFalse)
      window.removeEventListener('blur', handleActivityFalse)
      window.removeEventListener('focus', handleActivityTrue)
      document.removeEventListener('focus', handleActivityTrue)
    }
  }, [])

  return (
    <FocusContext.Provider value={windowIsActive}>
      {props.children}
    </FocusContext.Provider>
  )
}

function useFocus() {
  const context = useContext(FocusContext)
  return context
}
export { useFocus, FocusProvider }
