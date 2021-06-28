import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'

const ThemeSwitcher = () => {
  const [lightMode, setlightMode] = React.useState(false)

  useEffect(() => {
    const lsMode = window.localStorage.getItem('theme')
    if (lsMode) {
      setlightMode(true)
      document.body.classList.toggle('white-content')
    }
  }, [])

  const handleActiveMode = () => {
    const _lightMode = document.body.classList.contains('white-content')
    if (_lightMode) {
      setlightMode(false)
      window.localStorage.removeItem('theme')
    } else {
      setlightMode(true)
      window.localStorage.setItem('theme', true)
    }
    document.body.classList.toggle('white-content')
  }

  const btnClass = 'btn-transparent align-self-center mx-1'
  const iconClass = 'icon-small icon-dark m-0'

  return (
    <>
      {!lightMode && (
        <Button
          value={lightMode}
          type="Button"
          className={btnClass}
          onClick={handleActiveMode}
        >
          <i className={`icon-moon ${iconClass}`} />
        </Button>
      )}
      {lightMode && (
        <Button
          value={lightMode}
          type="Button"
          className={btnClass}
          onClick={handleActiveMode}
        >
          <i className={`icon-sun ${iconClass}`} />
        </Button>
      )}
    </>
  )
}

export default ThemeSwitcher
