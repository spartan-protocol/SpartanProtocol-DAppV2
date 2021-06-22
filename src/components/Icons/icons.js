import React from 'react'
import { ReactComponent as ArrowDown } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-up.svg'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import { ReactComponent as Info } from '../../assets/icons/info.svg'
import { ReactComponent as Lock } from '../../assets/icons/lock.svg'
import { ReactComponent as Plus } from '../../assets/icons/plus.svg'
import { ReactComponent as Search } from '../../assets/icons/search.svg'
import { ReactComponent as SwapAdd } from '../../assets/icons/swap-add.svg'

const icons = {
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  close: Close,
  info: Info,
  lock: Lock,
  plus: Plus,
  search: Search,
  swapAdd: SwapAdd,
}

/**
 * Get the custom icon from imported list.
 * If placing this inside an OverlayTrigger:
 * make sure you wrap it in span / div or similar
 * @param {string} icon id of the icon requested (required)
 * @param {string} className normal className string (optional)
 * @param {string} size width & height in one (optional)
 * @param {string} height height in px (optional)
 * @param {string} width width in px (optional)
 * @param {string} style (optional)
 * @returns {Component} Custom Icon imported as ReactComponent
 */
export const Icon = (props) => {
  const CustomIcon = icons[props.icon]
  return (
    <>
      <CustomIcon
        className={props.className || ''}
        height={props.size || props.height || '40'}
        width={props.size || props.width || '40'}
        fill={props.fill || 'white'}
        style={props.style || null}
      />
    </>
  )
}
