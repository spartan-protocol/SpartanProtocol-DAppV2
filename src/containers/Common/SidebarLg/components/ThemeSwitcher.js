import React from 'react'
import { useTheme } from '../../../../providers/Theme'
import './themeSwitcher.scss'

const ThemeSwitcher = ({ extended }) => {
  const theme = useTheme()
  return (
    <div
      className={
        extended ? 'd-flex flex-1 w-100 px-4 py-2 mb-1' : 'px-2 py-2 mb-1'
      }
    >
      <div className="switch">
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
      {extended && (
        <div
          className="px-2"
          onClick={() => theme.toggleDark()}
          aria-hidden="true"
        >
          Switch theme
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcher
