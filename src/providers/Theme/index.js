import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()
// const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)') // Un-comment this line when/if we update the light theming/style to a better standard

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true) // Dark theme by default

  // On manual theme mode toggle (persistent state for user)
  const toggleDark = () => {
    if (isDark) {
      setIsDark(false)
      document.body.classList.toggle('dark-theme', false)
      window.localStorage.setItem('sp-lightMode', true) // we should only update localStorage when user specifically selects the theme
    } else {
      setIsDark(true)
      document.body.classList.toggle('dark-theme', true)
      window.localStorage.removeItem('sp-lightMode') // we should only update localStorage when user specifically selects the theme
    }
  }

  // On theme toggle (non-persistent state for user)
  const toggleIsDarkOnly = (bool) => {
    setIsDark(bool)
    document.body.classList.toggle('dark-theme', bool)
  }

  // On load
  useEffect(() => {
    if (window.localStorage.getItem('sp-lightMode')) {
      // 1st priority: Persistent state from localStorage (ie. the user's specified preference)
      toggleIsDarkOnly(false) // If user previously selected light mode as their preference
      // We dont need to check for 'dark' preference as thats the default/fallback
    } else {
      // If the user has not specified a preference into localStorage, fall back to conditional logic
      // 2nd priority: system dark theme
      // toggleDarkOnly(darkThemeMq.matches) // Un-comment this line when/if we update the light theming/style to a better standard
      toggleIsDarkOnly(true) // Delete this line when/if we update the light theming/style to a better standard

      /* Listen for changes to user's system-theme after the initial load
      Uncomment below when/if we update the light theming/style to a better standard */
      // darkThemeMq.addEventListener('change', (e) => {
      //   toggleIsDarkOnly(e.matches)
      // })
    }
  }, [])

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
