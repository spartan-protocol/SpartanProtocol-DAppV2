import React from 'react'
import './styles.scss'

const Backdrop = ({ show, onClick }) =>
  show && (
    <div
      className="backdrop"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(event) => event.key === KeyboardEvent.escape && onClick()}
    />
  )

export default Backdrop
