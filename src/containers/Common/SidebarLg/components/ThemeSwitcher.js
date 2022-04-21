import React from 'react'
import { useTheme } from '../../../../providers/Theme'
import './themeSwitcher.scss'

const ThemeSwitcher = () => {
  const theme = useTheme()
  return (
    <>
      <div className="switch d-inline-block ms-2">
        <label className="switch__label" htmlFor="Switch">
          <input
            type="checkbox"
            className="switch__input"
            id="Switch"
            defaultChecked={!theme.isDark}
            onChange={() => theme.toggleDark()}
          />
          <span className="switch__indicator" />
          <span className="switch__decoration" />
        </label>
      </div>
    </>
  )
}

export default ThemeSwitcher
