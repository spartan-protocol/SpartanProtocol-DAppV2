/* eslint-disable*/

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

const ShareLink = (props) => {
  const { t } = useTranslation()
  // const notificationAlertRef = React.useRef(null)

  const notify = (place, color) => {
    let type
    switch (color) {
      case 1:
        type = 'primary'
        break
      case 2:
        type = 'success'
        break
      case 3:
        type = 'danger'
        break
      case 4:
        type = 'warning'
        break
      case 5:
        type = 'info'
        break
      default:
        break
    }

    let options = {}
    options = {
      place,
      message: (
        <div>
          <div>{t('copyNotification')}</div>
        </div>
      ),
      type,
      icon: 'icon-extra-small icon-scan',
      autoDismiss: 2,
    }
    // notificationAlertRef.current.notificationAlert(options)
  }

  return (
    <>
      <div className="rna-container share-notification">
        {/* <NotificationAlert ref={notificationAlertRef} /> */}
      </div>
      <CopyToClipboard
        text={props.url}
        onCopy={() => {
          notify(props.notificationLocation || 'tr', 'primary')
        }}
      >
        {props.children}
      </CopyToClipboard>
    </>
  )
}

export default ShareLink
