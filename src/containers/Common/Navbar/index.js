import React from 'react'
import { Link } from 'react-router-dom'
import LanguageDropdown from './components/LanguageDropdown'
import AddressConn from './components/AddressConn'
import ThemeSwitcher from './components/ThemeSwitcher'
import Supply from './components/Supply'
import Contracts from './components/Contracts'
import Sidebar from '../Sidebar'
import { Icon } from '../../../components/Icons/index'

import * as styles from './styles.module.scss'
import { useBreakpoint } from '../../../components/Breakpoint'

const Navbar = () => {
  const breakpoint = useBreakpoint()
  return (
    <div className={styles.navbar}>
      {!breakpoint.lg && (
        <div>
          <Sidebar />
          <div className={styles.brand}>
            <Link to="/">
              <Icon icon="spartav2" size="35" />
            </Link>
          </div>
        </div>
      )}
      <div className={styles.buttons}>
        <ThemeSwitcher />
        <LanguageDropdown />
        <AddressConn />
        <Contracts />
        <Supply />
      </div>
    </div>
  )
}

export default Navbar
