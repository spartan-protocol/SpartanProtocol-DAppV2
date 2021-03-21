import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap'
import React from 'react'

const Wallet = () => (
  <>
    <UncontrolledDropdown>
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
      <DropdownMenu aria-labelledby="dropdownMenuButton">
        <DropdownItem
          className="text-center"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          Available Balance
          <DropdownItem divider />
        </DropdownItem>
        <DropdownItem href="">
          SPARTA : <span className="float-right">XXX</span>
        </DropdownItem>
        <DropdownItem href="">
          BNB: <span className="float-right">XXX</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          className="text-primary text-center"
          onClick={(e) => e.preventDefault()}
        >
          View all assets
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </>
)
export default Wallet
