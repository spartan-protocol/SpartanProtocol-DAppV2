import React from 'react'
import './styles.scss'
import RecentTxns from '../RecentTxns/RecentTxns'

const Drawer = (props) => {
  let drawerClasses = 'side-drawer'
  if (props.show) {
    drawerClasses = 'side-drawer open'
  }
  return (
    <div className={drawerClasses} id="txnDrawer">
      <RecentTxns />
    </div>
  )
}

export default Drawer
