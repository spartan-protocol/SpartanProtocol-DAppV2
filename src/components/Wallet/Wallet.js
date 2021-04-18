import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap'
import React from 'react'
import { formatFromWei } from '../../utils/bigNumber'

const Wallet = ({ coins }) => (
  <>
    <UncontrolledButtonDropdown
      style={{
        width: '100%',
      }}
    >
      <DropdownToggle
        aria-expanded={false}
        aria-haspopup
        caret
        className="btn-block"
        color="default"
        data-toggle="dropdown"
        id="dropdownMenuButton"
        type="button"
      >
        Wallet
      </DropdownToggle>
      <DropdownMenu
        aria-labelledby="dropdownMenuButton"
        style={{
          width: '100%',
          top: '30px !important',
        }}
      >
        <DropdownItem
          className="text-center"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          Available Balance
          <DropdownItem divider />
        </DropdownItem>
        {coins
          ?.filter((coin) => Math.floor(coin.tokenAmount))
          .map((coin) => (
            <>
              <DropdownItem href="">
                {coin.symbol} :{' '}
                <span className="float-right">
                  {formatFromWei(coin.tokenAmount)}
                </span>
              </DropdownItem>
            </>
          ))}
        <DropdownItem divider />
        <DropdownItem
          className="text-primary text-center"
          onClick={(e) => e.preventDefault()}
        >
          View all assets
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  </>
)
export default Wallet
