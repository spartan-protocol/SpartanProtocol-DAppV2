import React, { useRef, useState } from 'react'

// i18n
import { Button, Col, Overlay, Popover, Row } from 'react-bootstrap'
import i18n from '../../i18n'

// flags
import auFlag from '../../assets/flags/au.svg'
import gbFlag from '../../assets/flags/gb.svg'
import usFlag from '../../assets/flags/us.svg'
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

const getEnFlag = () => {
  const enCountry = navigator.language.slice(-2)
  if (enCountry === 'AU') {
    return auFlag
  }
  if (enCountry === 'US') {
    return usFlag
  }
  return gbFlag
}

const locales = [
  {
    id: 'en',
    name: 'English',
    flag: getEnFlag(),
  },
  {
    id: 'zh',
    name: '中国人',
    flag: cnFlag,
  },
  {
    id: 'es',
    name: 'Español',
    flag: esFlag,
  },
  {
    id: 'fr',
    name: 'Français',
    flag: frFlag,
  },
  {
    id: 'af',
    name: 'Afrikaans',
    flag: zaFlag,
  },
  {
    id: 'bn',
    name: 'বাংলা',
    flag: inFlag,
  },
  {
    id: 'de',
    name: 'Deutsche',
    flag: deFlag,
  },
  {
    id: 'el',
    name: 'Ελληνικά',
    flag: grFlag,
  },
  {
    id: 'fa',
    name: 'فارسی',
    flag: irFlag,
  },
  {
    id: 'hi',
    name: 'हिंदी',
    flag: inFlag,
  },
  {
    id: 'it',
    name: 'Italiano',
    flag: itFlag,
  },
  {
    id: 'nl',
    name: 'Nederlands',
    flag: nlFlag,
  },
  {
    id: 'pa',
    name: 'ਪੰਜਾਬੀ',
    flag: inFlag,
  },
  {
    id: 'pl',
    name: 'Polskie',
    flag: plFlag,
  },
  {
    id: 'pt',
    name: 'Português',
    flag: ptFlag,
  },
  {
    id: 'ro',
    name: 'Română',
    flag: roFlag,
  },
  {
    id: 'ru',
    name: 'Pусский',
    flag: ruFlag,
  },
  {
    id: 'sv',
    name: 'Svenska',
    flag: seFlag,
  },
  {
    id: 'uk',
    name: 'Український',
    flag: uaFlag,
  },
]

const getLocale = () => locales?.filter((x) => x.id === i18n.languages[0])[0]

const LanguageDropdown = () => {
  const [showDropdown, setshowDropdown] = useState(false)
  const target = useRef(null)
  const [flag, setFlag] = useState(getLocale()?.flag || locales[0]?.flag)

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang)
    setFlag(getLocale().flag)
  }

  return (
    <>
      <Button
        id="PopoverClick1"
        type="Button"
        className="btn-round btn-transparent btn-icon ms-1"
        onClick={() => setshowDropdown(!showDropdown)}
        ref={target}
      >
        <img src={flag} alt="flag" className="icon-small" />
        {/* <i className="icon-small icon-lang icon-dark mt-2" /> */}
      </Button>
      <Overlay
        target={target.current}
        show={showDropdown}
        placement="bottom"
        onHide={() => setshowDropdown(false)}
        rootClose
      >
        <Popover>
          <Popover.Header>Language</Popover.Header>
          <Popover.Body>
            <Row>
              {locales.map((x) => (
                <Col xs={6} key={x.id} className="pl-3 pr-1">
                  <Button
                    onClick={() => changeLanguageAction(x.id)}
                    className="btn-transparent"
                  >
                    <span className="output-card">
                      <img src={x.flag} alt="Spartan" height="12" />
                      {` ${x.name}`}
                    </span>
                  </Button>
                </Col>
              ))}
            </Row>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

export default LanguageDropdown
