import React, { useRef, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'
import Row from 'react-bootstrap/Row'

// i18n
import i18n from '../../../../i18n'

// flags
import auFlag from '../../../../assets/flags/au.svg'
import gbFlag from '../../../../assets/flags/gb.svg'
import usFlag from '../../../../assets/flags/us.svg'
import cnFlag from '../../../../assets/flags/cn.svg'
import esFlag from '../../../../assets/flags/es.svg'
import deFlag from '../../../../assets/flags/de.svg'
import frFlag from '../../../../assets/flags/fr.svg'
import grFlag from '../../../../assets/flags/gr.svg'
import inFlag from '../../../../assets/flags/in.svg'
import irFlag from '../../../../assets/flags/ir.svg'
import itFlag from '../../../../assets/flags/it.svg'
import nlFlag from '../../../../assets/flags/nl.svg'
import plFlag from '../../../../assets/flags/pl.svg'
import ptFlag from '../../../../assets/flags/pt.svg'
import roFlag from '../../../../assets/flags/ro.svg'
import ruFlag from '../../../../assets/flags/ru.svg'
import seFlag from '../../../../assets/flags/se.svg'
import trFlag from '../../../../assets/flags/tr.svg'
import uaFlag from '../../../../assets/flags/ua.svg'
import vnFlag from '../../../../assets/flags/vn.svg'
import zaFlag from '../../../../assets/flags/za.svg'

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
    name: 'Polski',
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
    id: 'tr',
    name: 'Türkçe',
    flag: trFlag,
  },
  {
    id: 'uk',
    name: 'Український',
    flag: uaFlag,
  },
  {
    id: 'vi',
    name: 'Tiếng Việt',
    flag: vnFlag,
  },
]

const getLocale = () => locales?.filter((x) => x.id === i18n.languages[0])[0]

const LanguageDropdown = ({ centered }) => {
  const [showDropdown, setshowDropdown] = useState(false)
  const target = useRef(null)
  const [flag, setFlag] = useState(getLocale()?.flag || locales[0]?.flag)

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang)
    setFlag(getLocale().flag)
    setshowDropdown(!showDropdown)
  }

  return (
    <>
      <div
        ref={target}
        role="button"
        className="d-inline-block ms-2"
        onClick={() => setshowDropdown(!showDropdown)}
        aria-hidden="true"
      >
        <img src={flag} alt="flag" height="21" className="rounded" />
      </div>
      <Overlay
        target={target.current}
        show={showDropdown}
        placement={centered ? 'top' : 'right'}
        onHide={() => setshowDropdown(false)}
        rootClose
      >
        <Popover>
          <Popover.Header>Language</Popover.Header>
          <Popover.Body>
            <Row>
              {locales.map((x) => (
                <Col xs={6} key={x.id} className="">
                  <Button
                    variant="outline-secondary"
                    onClick={() => changeLanguageAction(x.id)}
                    className="w-100 mb-1 p-1"
                  >
                    <span className="">
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
