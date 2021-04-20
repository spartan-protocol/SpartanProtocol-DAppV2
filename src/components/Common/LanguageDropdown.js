/*eslint-disable*/
import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

// i18n
import { withNamespaces } from 'react-i18next'
import i18n from '../../i18n'

// flags
import enFlag from '../../assets/img/flags/en.png'
import nlFlag from '../../assets/img/flags/nl.png'

const LanguageDropdown = () => {
  const [menu, setMenu] = useState(false)
  const [lng, setLng] = useState('English')
  // const [flag,setFlag] = useState(usFlag);

  const changeLanguageAction = (lang) => {
    // set language as i18n
    i18n.changeLanguage(lang)

    if (lang === 'eng') {
      setLng('English')
    } else if (lang === 'nl') {
      // setFlag(vietnam);
      setLng('Dutch')
    }
  }
  const toggle = () => {
    setMenu(!menu)
  }

  return (
    <>
      <Dropdown
        isOpen={menu}
        toggle={toggle}
        className="d-inline-block align-self-center ml-2"
      >
        <DropdownToggle
          aria-expanded={false}
          aria-haspopup
          className="btn-round btn-icon ml-n1"
          color="default"
          data-toggle="dropdown"
          id="dropdownMenuButton"
          type="button"
        >
          <i className="icon-small icon-lang icon-dark m-0 mt-1" />
        </DropdownToggle>
        <DropdownMenu className="language-switch" right>
          <DropdownItem header>Language</DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('eng')}
            className={`notify-item ${lng === 'English' ? 'active' : 'none'}`}
          >
            <img src={enFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">English</span>
          </DropdownItem>
          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('nl')}
            className={`notify-item ${
              lng === 'Dutch' ? 'active' : 'none'
            }`}
          >
            <img src={nlFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Nederlands</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default withNamespaces()(LanguageDropdown)
