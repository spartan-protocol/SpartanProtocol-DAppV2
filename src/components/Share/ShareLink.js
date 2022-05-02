import React from 'react'

export const writeToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Need to trigger a toast/alert
  } catch (error) {
    console.error('write to clipboard error', error)
  }
}

const ShareLink = (props) => {
  const { url, children } = props

  return (
    <div
      onClick={() => writeToClipboard(url)}
      role="button"
      aria-hidden="true"
      className="zoomactive d-inline-block"
    >
      {children}
    </div>
  )
}

export default ShareLink
