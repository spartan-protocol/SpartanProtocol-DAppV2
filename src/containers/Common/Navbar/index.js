import React from 'react'
import { Link } from 'react-router-dom'
import AddressConn from './components/AddressConn'
import Supply from './components/Supply'
import Sidebar from '../Sidebar'
import { Icon } from '../../../components/Icons/index'

import styles from './styles.module.scss'
import { useBreakpoint } from '../../../providers/Breakpoint'

const Navbar = ({ fixed, handleCompact, sideNavIcon, handleSideNavState }) => {
  const breakpoint = useBreakpoint()

  return (
    <div className={`${styles.navbar} bg-2`}>
      {!breakpoint.lg ? (
        <div className={styles.hammy}>
          <Sidebar />
          <div className={styles.brand}>
            <Link to="/">
              <Icon icon="spartav2" size="35" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <span
            className="pt-4 px-4 h-100"
            role="button"
            onClick={() => handleSideNavState()}
            aria-hidden="true"
            onMouseEnter={() => !fixed && handleCompact(false)}
            onMouseLeave={() => !fixed && handleCompact(true)}
          >
            <Icon icon={sideNavIcon} size="24" />
          </span>
          <Link to="/">
            <div>
              <Icon icon="spartaText" height="100%" width="260" />
            </div>
          </Link>
        </>
      )}
      <div className={styles.buttons}>
        <AddressConn />
        <Supply />
      </div>
    </div>
  )
}

export default Navbar
