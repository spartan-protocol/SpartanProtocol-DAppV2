import React from 'react'
import {
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { usePoolFactory } from '../../store/poolFactory'
// import { formatFromWei } from '../../utils/bigNumber'
import coinBnb from '../../assets/icons/coin_bnb.svg'
import coinSparta from '../../assets/icons/coin_sparta.svg'

/**
 * An asset selection dropdown. Selection is stored in localStorage under 'assetSelected1' or 'assetSelected2'
 * depending on the 'priority' prop handed over.
 * Can be extended out with 'assetSelected3' etc in the future but the current views will only handle '1' and '2' for now
 * @param {uint} priority '1' or '2'
 * @param {string} type 'pools' (Shows SP-p related fields)
 * @param {array} whiteList tokenAddresses [array]
 * @param {array} blackList tokenAddresses [array]
 */
const AssetSelect = (props) => {
  const poolFactory = usePoolFactory()

  const addSelection = (asset) => {
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify(asset),
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
          {props.type === 'pools' && <img src={coinSparta} alt="BNB" />}
          <img className="mr-2" src={coinBnb} alt="BNB" />
          {props.type === 'pools' && 'SP-p'}
          {selectedItem && selectedItem.symbol}
        </DropdownToggle>
        <DropdownMenu aria-labelledby="dropdownMenuButton">
          <DropdownItem header>Select Asset</DropdownItem>
          {poolFactory.finalArray &&
            !props.whiteList &&
            !props.blackList &&
            poolFactory.finalArray
              .sort((a, b) => b.balanceTokens - a.balanceTokens)
              .map((asset) => (
                <DropdownItem
                  key={asset.tokenAddress}
                  onClick={() => addSelection(asset)}
                >
                  {props.type === 'pools' && <img src={coinSparta} alt="BNB" />}
                  <img className="mr-2" src={coinBnb} alt="BNB" />{' '}
                  {props.type === 'pools' && 'SP-p'}
                  {asset.symbol}
                </DropdownItem>
              ))}
          {poolFactory.finalArray &&
            props.whiteList &&
            poolFactory.finalArray
              .filter((asset) =>
                props.whiteList.find((item) => item === asset.tokenAddress),
              )
              .sort((a, b) => b.balanceTokens - a.balanceTokens)
              .map((asset) => (
                <DropdownItem
                  key={asset.tokenAddress}
                  onClick={() => addSelection(asset)}
                >
                  {props.type === 'pools' && <img src={coinSparta} alt="BNB" />}
                  <img className="mr-2" src={coinBnb} alt="BNB" />{' '}
                  {props.type === 'pools' && 'SP-p'}
                  {asset.symbol}
                </DropdownItem>
              ))}
          {poolFactory.finalArray &&
            props.blackList &&
            poolFactory.finalArray
              .filter(
                (asset) =>
                  props.blackList.find(
                    (item) => asset.tokenAddress === item,
                  ) === undefined,
              )
              .sort((a, b) => b.balanceTokens - a.balanceTokens)
              .map((asset) => (
                <DropdownItem
                  key={asset.tokenAddress}
                  onClick={() => addSelection(asset)}
                >
                  {props.type === 'pools' && <img src={coinSparta} alt="BNB" />}
                  <img className="mr-2" src={coinBnb} alt="BNB" />{' '}
                  {props.type === 'pools' && 'SP-p'}
                  {asset.symbol}
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
