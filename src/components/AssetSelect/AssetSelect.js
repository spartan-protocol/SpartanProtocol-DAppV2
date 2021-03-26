import React from 'react'
import {
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { usePoolFactory } from '../../store/poolFactory'
import { formatFromWei } from '../../utils/bigNumber'
import coinBnb from '../../assets/icons/coin_bnb.svg'

/**
 * An asset selection dropdown. Selection is stored in localStorage under 'assetSelected1' or 'assetSelected2'
 * depending on the 'priority' prop handed over.
 * Can be extended out with 'assetSelected3' etc in the future but the current views will only handle '1' and '2' for now
 * @param {uint} priority '1' or '2'
 */
const AssetSelect = (props) => {
  const poolFactory = usePoolFactory()

  const addSelection = (assetSymbol, assetAddress) => {
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify([assetSymbol, assetAddress]),
    )
  }

  const selectedItem = JSON.parse(
    window.localStorage.getItem(`assetSelected${props.priority}`),
  )

  return (
    <>
      <UncontrolledDropdown>
        <DropdownToggle
          aria-expanded={false}
          aria-haspopup
          caret
          className=""
          color=""
          data-toggle="dropdown"
          id="dropdownMenuButton"
          type="button"
        >
          <img className="mr-2" src={coinBnb} alt="BNB" />
          {selectedItem && selectedItem[0]}
        </DropdownToggle>
        <DropdownMenu aria-labelledby="dropdownMenuButton">
          <DropdownItem header>Select Asset</DropdownItem>
          {poolFactory.finalArray &&
            poolFactory.finalArray.map((asset) => (
              <DropdownItem
                key={asset.tokenAddress}
                onClick={() => addSelection(asset.symbol, asset.tokenAddress)}
              >
                <img className="mr-2" src={coinBnb} alt="BNB" /> {asset.symbol}{' '}
                - {formatFromWei(asset.balanceTokens)}
              </DropdownItem>
            ))}
          {poolFactory.finalArray === null && (
            <DropdownItem>...LOADER...</DropdownItem>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default AssetSelect
