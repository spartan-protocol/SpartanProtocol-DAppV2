import React from 'react'

/**
 * Create a customizable space
 * @param {string} className normal className string (optional)
 * @param {string} size width & height in one (optional)
 * @param {string} height height in px (optional)
 * @param {string} width width in px (optional)
 * @returns {Component} Custom Icon imported as ReactComponent
 */
export const Spacer = (props) => {
  const theStyle = {}
  if (props.size) {
    theStyle.height = props.size
    theStyle.width = props.size
  }
  if (props.height) {
    theStyle.height = props.height
  }
  if (props.width) {
    theStyle.width = props.width
  }
  return (
    <>
      <div className={`${props.className} d-inline-block`} style={theStyle} />
    </>
  )
}
