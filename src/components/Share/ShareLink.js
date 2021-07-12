import React from 'react'

const ShareLink = (props) => {
  const { url, children } = props

  const writeToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Need to trigger a toast/alert
    } catch (error) {
      console.error('write to clipboard error', error)
    }
  }

  return (
    <div
      onClick={() => writeToClipboard(url)}
      role="button"
      aria-hidden="true"
      className="zoomactive"
    >
      {children}
    </div>
  )
}

export default ShareLink
