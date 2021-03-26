import React from 'react'
import {
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { usePoolFactory } from '../../store/poolFactory'
import { formatFromWei } from '../../utils/bigNumber'

/**
 * An asset selection dropdown. Selection is stored in localStorage under 'assetSelected1' or 'assetSelected2'
 * depending on the 'priority' prop handed over.
 * Can be extended out with 'assetSelected3' etc in the future but the current views will only handle '1' and '2' for now
 * @param {uint} priority '1' or '2'
 */
const AssetSelect = (props) => {
  const poolFactory = usePoolFactory()

  const addSelection = (assetDetails) => {
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify(assetDetails),
    )
  }

  return (
    <>
      <UncontrolledDropdown>
        <DropdownToggle
          aria-expanded={false}
          aria-haspopup
          caret
          className="btn-block"
          color="primary"
          data-toggle="dropdown"
          id="dropdownMenuButton"
          type="button"
        >
          {
            JSON.parse(
              window.localStorage.getItem(`assetSelected${props.priority}`),
            )?.symbol
          }
        </DropdownToggle>
        <DropdownMenu aria-labelledby="dropdownMenuButton">
          <DropdownItem header>Dropdown header</DropdownItem>
          {poolFactory.finalArray?.map((asset) => (
            <DropdownItem
              key={asset.tokenAddress}
              onClick={() => addSelection(asset)}
            >
              {asset.symbol} - {formatFromWei(asset.balanceTokens)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default AssetSelect
