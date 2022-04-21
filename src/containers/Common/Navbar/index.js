import React from 'react'
import { Link } from 'react-router-dom'
import AddressConn from './components/AddressConn'
import Supply from './components/Supply'
import Sidebar from '../Sidebar'
import { Icon } from '../../../components/Icons/index'

import styles from './styles.module.scss'
import { useBreakpoint } from '../../../providers/Breakpoint'

const Navbar = () => {
  const breakpoint = useBreakpoint()
  return (
    <div className={`${styles.navbar} bg-2`}>
      {!breakpoint.lg && (
        <div className={styles.hammy}>
          <Sidebar />
          <div className={styles.brand}>
            <Link to="/">
              <Icon icon="spartav2" size="35" />
            </Link>
          </div>
        </div>
      )}
      <div className={styles.buttons}>
        <AddressConn />
        <Supply />
      </div>
    </div>
  )
}

export default Navbar
