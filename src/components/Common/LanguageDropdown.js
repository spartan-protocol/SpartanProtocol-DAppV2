import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

// i18n
import i18n from '../../i18n'

// flags
import enFlag from '../../assets/flags/au.svg'
import hiFlag from '../../assets/flags/in.svg'
import esFlag from '../../assets/flags/es.svg'
import frFlag from '../../assets/flags/fr.svg'
import bnFlag from '../../assets/flags/bn.svg'
import ruFlag from '../../assets/flags/ru.svg'

import nlFlag from '../../assets/flags/nl.svg'

const LanguageDropdown = () => {
  const [menu, setMenu] = useState(false)
  const [lng, setLng] = useState('en')
  // const [flag,setFlag] = useState(usFlag);

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang)
    setLng(lang)
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
          className="btn-round btn-transparent btn-icon ml-n1"
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
            onClick={() => changeLanguageAction('en')}
            className={`notify-item ${lng === 'en' ? 'active' : 'none'}`}
          >
            <img src={enFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">English</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('hi')}
            className={`notify-item ${lng === 'hi' ? 'active' : 'none'}`}
          >
            <img src={hiFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Hindi</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('es')}
            className={`notify-item ${lng === 'es' ? 'active' : 'none'}`}
          >
            <img src={esFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Spanish</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('fr')}
            className={`notify-item ${lng === 'fr' ? 'active' : 'none'}`}
          >
            <img src={frFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">French</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('bn')}
            className={`notify-item ${lng === 'bn' ? 'active' : 'none'}`}
          >
            <img src={bnFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Bengali</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('ru')}
            className={`notify-item ${lng === 'ru' ? 'active' : 'none'}`}
          >
            <img src={ruFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Russian</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction('nl')}
            className={`notify-item ${lng === 'nl' ? 'active' : 'none'}`}
          >
            <img src={nlFlag} alt="Spartan" height="12" />
            <span className="align-middle ml-1 output-card">Nederlands</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default LanguageDropdown
