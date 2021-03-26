import React from 'react'
import {
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { usePoolFactory } from '../../store/poolFactory'

const AssetSelect = () => {
  const poolFactory = usePoolFactory()

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
          SYMBOL HERE
        </DropdownToggle>
        <DropdownMenu aria-labelledby="dropdownMenuButton">
          <DropdownItem header>Dropdown header</DropdownItem>
          {poolFactory.finalArray?.map((asset) => (
            <DropdownItem key={asset.tokenAddress}>
              {asset.symbol} - {asset.accountBalance}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default AssetSelect
