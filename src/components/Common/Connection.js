/* eslint-disable*/

import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Button
} from "reactstrap"

// i18n
import { withNamespaces } from 'react-i18next'
import i18n from '../../i18n'

// flags
import usFlag from '../../assets/img/flags/united-states.png'
import china from '../../assets/img/flags/china.png'
import russia from '../../assets/img/flags/russia.png'
import turkey from '../../assets/img/flags/turkey.png'
import vietnam from '../../assets/img/flags/vietnam.png'

const LanguageDropdown = () => {
  const [menu, setMenu] = useState(false)


  return (
    <>
      <Button
        type="button"
        className="btn-round btn-icon ml-4 mt-2 ">
        <i className="icon-small icon-cycle icon-dark mt-1" />
      </Button>
    </>
  )
}

export default withNamespaces()(LanguageDropdown)
