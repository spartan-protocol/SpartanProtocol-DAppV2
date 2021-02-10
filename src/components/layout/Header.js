import React from "react"
import {Link} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import WalletSelect from '../UI/WalletSelect'

const Header = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Container fluid id='header'>
                <Row className='h-100 mx-0'>
                    <Col id='logoCol' className='d-none d-sm-inline-block'>
                        <Link to="/" className='d-flex h-100 w-100'>
                            <img src='./images/android-icon-48x48.png' alt='Spartan Protocol Icon' className='logo m-auto text-center' />
                        </Link>
                    </Col>
                    <Col id='logo-mobile' className='d-block d-sm-none'>
                        <Link to="/">
                            <img src='./images/android-icon-36x36.png' alt='Spartan Protocol Mobile Icon' className='m-2 text-center' />
                        </Link>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <Button variant="dark" className='mx-1'><i className='bi bi-house-fill' /></Button>
                        <Button variant="dark" className='mx-1'><i className='bi-lg bi-cloud-plus-fill' /><div className='d-none d-sm-inline-block ml-1'>Pools</div></Button>
                        <Button variant="dark" className='mx-1'><i className='bi-lg bi-people-fill' /><div className='d-none d-sm-inline-block ml-1'>DAO</div></Button>
                        <Button variant="dark" className='mx-1'><i className='bi-lg bi-info-circle' /><div className='d-none d-sm-inline-block ml-1'>Info</div></Button>
                    </Col>
                    <Col className='header-section'>
                        <Button variant="dark" className='mx-1'><i className='bi-lg bi-file-code-fill' /></Button>
                        <Button variant="dark" className='mx-1'><i className='bi-lg bi-sun' /></Button>
                        {/* ICON BASED ON WALLET TYPE (METAMASK/TRUST ETC) */}
                        <Button variant="dark" className='mx-1' onClick={() => setModalShow(true)}><i className='bi-lg bi-wallet-fill' /></Button>
                    </Col>
                </Row>
                <WalletSelect
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </Container>
        </>
    )
}

export default Header