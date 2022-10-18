import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AddressConn from './components/AddressConn'
import Supply from './components/Supply'
import Sidebar from '../Sidebar'
import { Icon } from '../../../components/Icons/index'

import styles from './styles.module.scss'
import { useBreakpoint } from '../../../providers/Breakpoint'
import OnboardModal from '../../../components/Onboarding'

const Navbar = ({ fixed, handleCompact, sideNavIcon, handleSideNavState }) => {
  const breakpoint = useBreakpoint()

  const [showOnboarding, setshowOnboarding] = useState(false)

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
            <div className="h-100">
              <Icon icon="spartaText" height="100%" width="260" />
            </div>
          </Link>
        </>
      )}
      <div className={styles.buttons}>
        <div
          role="button"
          className={styles.headerBtn}
          onClick={() => setshowOnboarding(true)}
          onKeyPress={() => setshowOnboarding(true)}
          aria-hidden="true"
        >
          <Icon icon="bankCards" size="24" />
        </div>
        {showOnboarding && (
          <OnboardModal
            showModal={showOnboarding}
            setshowModal={setshowOnboarding}
          />
        )}
        <AddressConn />
        <Supply />
      </div>
    </div>
  )
}

export default Navbar
