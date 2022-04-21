import React, { useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageDropdown from './LanguageDropdown'
import { Icon } from '../../../../components/Icons'
import Settings from '../../../../components/Settings'

const Utilities = ({ centered }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className={centered ? 'text-center mb-2' : 'mb-4'}>
      <Settings showModal={showModal} setShowModal={setShowModal} />
      <div
        className="d-inline-block"
        role="button"
        aria-hidden="true"
        onClick={() => setShowModal(!showModal)}
      >
        <Icon icon="settings" size="22" />
      </div>
      <ThemeSwitcher />
      <LanguageDropdown centered />
    </div>
  )
}

export default Utilities
