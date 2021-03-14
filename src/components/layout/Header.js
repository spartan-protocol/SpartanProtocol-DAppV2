import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import WalletSelect from '../WalletSelect/WalletSelect'
import walletTypes from '../WalletSelect/walletTypes'

const Header = () => {
  const [modalShow, setModalShow] = useState(false)
  const [walletHeaderIcon] = useState(walletTypes[0].icon)

  useEffect(() => {
    const checkTheme = () => {
      if (window.localStorage.getItem('lightMode')) {
        console.log(
          'Light theme activated via preference stored in users local storage!',
        )
        document.body.setAttribute('data-theme', 'light')
      }
    }

    checkTheme()
  }, [])

  const switchTheme = () => {
    if (window.localStorage.getItem('lightMode')) {
      window.localStorage.removeItem('lightMode')
      document.body.removeAttribute('data-theme')
      console.log('Light mode activated manually!')
    } else {
      window.localStorage.setItem('lightMode', '1')
      document.body.setAttribute('data-theme', 'light')
      console.log('Dark mode activated manually!')
    }
  }

  // ADD A USEEFFECT HERE TO CHECK WALLET STATUS
  // CREATE SVGS TO REPRESENT EACH CONNECTION STATUS
  // UPDATE WALLETHEADERICON IF 'CONNECTING' OR 'DISCONNECTED' ETC

  return (
    <>
      <Container fluid id="header">
        <Row className="h-100 mx-0">
          <Col id="logoCol" className="">
            <Link to="/" className="d-flex h-100 w-100">
              <img
                src="./images/android-icon-48x48.png"
                alt="Spartan Protocol SpartanIcons"
                className="logo m-auto text-center"
              />
            </Link>
          </Col>
          <Col className="d-flex align-items-center">
            <Link to="/pools">
              <Button variant="dark" className="mx-1">
                <i className="bi-lg bi-cloud-plus-fill" />
                <div className="d-none d-sm-inline-block ml-1">Pools</div>
              </Button>
            </Link>
            <Link to="/samples">
              <Button variant="dark" className="mx-1">
                <i className="bi-lg bi-people-fill" />
                <div className="d-none d-sm-inline-block ml-1">Samples</div>
              </Button>
            </Link>
          </Col>
          <Col className="header-section">
            <Button
              variant="dark"
              className="mx-1"
              onClick={() => switchTheme()}
            >
              <i className="bi-lg bi-sun" />
            </Button>
          </Col>
          <Col id="logoCol" onClick={() => setModalShow(true)}>
            <div className="d-flex h-100 w-100">
              <img
                src={walletHeaderIcon}
                alt="Spartan Protocol SpartanIcons"
                className="logo m-auto text-center"
              />
            </div>
          </Col>
        </Row>
        <WalletSelect
          show={modalShow}
          onHide={() => setModalShow(false)}
          // setWalletHeaderIcon={setWalletHeaderIcon}
        />
      </Container>
    </>
  )
}

export default Header
