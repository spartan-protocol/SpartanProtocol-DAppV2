import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  // On load
  useEffect(() => {
    if (window.localStorage.getItem('theme') === 'true') {
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
