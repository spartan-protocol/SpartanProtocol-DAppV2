import React from 'react'

export const writeToClipboard = async (targetText) => {
  if (navigator.clipboard && navigator.permissions) {
    try {
      await navigator.clipboard.writeText(targetText)
    } catch (error) {
      console.error('write to clipboard error', error)
    }
  } else if (document.queryCommandSupported('copy')) {
    try {
      const newEl = document.createElement('textarea') // Create element to copy
      newEl.value = targetText // Update the elements value to targetText
      newEl.style.top = '0' // Avoid scrolling to bottom
      newEl.style.left = '0' // Avoid scrolling to bottom
      newEl.style.position = 'fixed' // Avoid scrolling to bottom
      document.body.appendChild(newEl) // Add the element to body so its visible to the document api
      newEl.select() // Select the new element
      document.execCommand('copy') // Copy the value of the new element
      document.body.removeChild(newEl) // Remove the element from the DOM
    } catch (error) {
      console.error('write to clipboard error', error)
    }
  }
}

const ShareLink = (props) => {
  const { url, children } = props

  return (
    <div
      onClick={() => writeToClipboard(url)} // Need to trigger a toast/alert
      role="button"
      aria-hidden="true"
      className="zoomactive d-inline-block"
    >
      {children}
    </div>
  )
}

export default ShareLink
