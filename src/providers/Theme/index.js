import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()
const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  // On load
  useEffect(() => {
    /* Code below can be used wether to check if user changes his prefered system-theme mid-use Dapp
     darkThemeMq.addEventListener('change', (e) => {
      if (e.matches) {
        setIsDark(true)
        document.body.classList.toggle('dark-theme', true)
      } else {
        setIsDark(false)
        document.body.classList.toggle('dark-theme', false)
      }
    }) */
    if (!darkThemeMq.matches) {
      setIsDark(true)
      document.body.classList.toggle('dark-theme', true)
    }
  }, [])

  // On toggle
  const toggleDark = () => {
    document.body.classList.toggle('dark-theme', !isDark)
    window.localStorage.setItem('theme', !isDark)
    setIsDark(!isDark)
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export { useTheme, ThemeProvider }
