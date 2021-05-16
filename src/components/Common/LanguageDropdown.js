import React, { useState } from 'react'
import {
  DropdownItem,
  Row,
  Col,
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap'

// i18n
import i18n from '../../i18n'

// flags
import auFlag from '../../assets/flags/au.svg'
import cnFlag from '../../assets/flags/cn.svg'
import esFlag from '../../assets/flags/es.svg'
import deFlag from '../../assets/flags/de.svg'
import frFlag from '../../assets/flags/fr.svg'
import grFlag from '../../assets/flags/gr.svg'
import inFlag from '../../assets/flags/in.svg'
import irFlag from '../../assets/flags/ir.svg'
import itFlag from '../../assets/flags/it.svg'
import nlFlag from '../../assets/flags/nl.svg'
import plFlag from '../../assets/flags/pl.svg'
import ptFlag from '../../assets/flags/pt.svg'
import roFlag from '../../assets/flags/ro.svg'
import ruFlag from '../../assets/flags/ru.svg'
import seFlag from '../../assets/flags/se.svg'
import uaFlag from '../../assets/flags/ua.svg'
import zaFlag from '../../assets/flags/za.svg'

const locales = [
  {
    id: 'af',
    name: 'Afrikaans',
    flag: zaFlag,
  },
  {
    id: 'bn',
    name: 'Bengali',
    flag: inFlag,
  },
  {
    id: 'de',
    name: 'German',
    flag: deFlag,
  },
  {
    id: 'el',
    name: 'Greek',
    flag: grFlag,
  },
  {
    id: 'en',
    name: 'English',
    flag: auFlag,
  },
  {
    id: 'es',
    name: 'Spanish',
    flag: esFlag,
  },
  {
    id: 'fa',
    name: 'Persian',
    flag: irFlag,
  },
  {
    id: 'fr',
    name: 'French',
    flag: frFlag,
  },
  {
    id: 'hi',
    name: 'Hindi',
    flag: inFlag,
  },
  {
    id: 'it',
    name: 'Italian',
    flag: itFlag,
  },
  {
    id: 'nl',
    name: 'Dutch',
    flag: nlFlag,
  },
  {
    id: 'pa',
    name: 'Punjabi',
    flag: inFlag,
  },
  {
    id: 'pl',
    name: 'Polish',
    flag: plFlag,
  },
  {
    id: 'pt',
    name: 'Portuguese',
    flag: ptFlag,
  },
  {
    id: 'ro',
    name: 'Romanian',
    flag: roFlag,
  },
  {
    id: 'ru',
    name: 'Russian',
    flag: ruFlag,
  },
  {
    id: 'sv',
    name: 'Swedish',
    flag: seFlag,
  },
  {
    id: 'uk',
    name: 'Ukrainian',
    flag: uaFlag,
  },
  {
    id: 'zh',
    name: 'Chinese',
    flag: cnFlag,
  },
]

const getLocale = () => locales?.filter((x) => x.id === i18n.languages[0])[0]

const LanguageDropdown = () => {
  const [lng, setLng] = useState(i18n.languages[0])
  const [flag, setFlag] = useState(getLocale()?.flag || locales[4]?.flag)

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang)
    setLng(lang)
    setFlag(getLocale().flag)
  }

  return (
    <>
      <Button
        id="PopoverClick1"
        type="Button"
        className="btn-round btn-transparent btn-icon ml-1"
        href="#"
      >
        <img src={flag} alt="flag" className="icon-small mt-2" />
        {/* <i className="icon-small icon-lang icon-dark mt-2" /> */}
      </Button>
      <UncontrolledPopover
        trigger="legacy"
        rootclose="true"
        placement="bottom"
        target="PopoverClick1"
      >
        <PopoverHeader className="mt-2">Language</PopoverHeader>
        <PopoverBody>
          <Row>
            {locales.map((x) => (
              <Col xs={6} key={x.id}>
                <DropdownItem
                  tag="a"
                  href="#"
                  onClick={() => changeLanguageAction(x.id)}
                  className={`notify-item ${lng === x.id ? 'active' : 'none'}`}
                >
                  <img src={x.flag} alt="Spartan" height="12" />
                  <span className="align-middle ml-1 output-card">
                    {x.name}
                  </span>
                </DropdownItem>
              </Col>
            ))}
          </Row>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  )
}

export default LanguageDropdown
