/* eslint-disable*/

import React from 'react'
import { useTranslation } from 'react-i18next'

const ShareLink = (props) => {
  const { t } = useTranslation()
  const {
    url,
    children,
    notificationLocation
  } = props

  const writeToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Need to trigger a toast/alert
    } catch (error) {
      console.error('write to clipboard error', error)
    }
  }

  return (
    <div onClick={() => writeToClipboard(url)} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

export default ShareLink

/*
// import CopyToClipboard from 'react-copy-to-clipboard'
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
<>
  <div className="rna-container share-notification">
    {<NotificationAlert ref={notificationAlertRef} />}
  </div>
  <CopyToClipboard
    text={url}
    onCopy={() => {
      notify(notificationLocation || 'tr', 'primary')
    }}
  >
    {children}
  </CopyToClipboard>
</>
*/
