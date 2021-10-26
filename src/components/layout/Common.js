import React from 'react'
// import NotificationAlert from 'react-notification-alert'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import SidebarLg from '../Sidebar/SidebarLg'
import DataManager from '../DataManager/DataManager'
// import { Icon } from '../Icons/icons'

const Common = () => (
  <div className="wrapper">
    <div className="rna-container" />
    <div className="main-panel">
      <DataManager />
      {/* <NotificationAlert ref={notificationAlertRef} /> */}
      <Header />
      <SidebarLg />
      <Footer />
    </div>
  </div>
)

export default Common
