import React from "react"
import {Link} from "react-router-dom";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Button from 'react-bootstrap/Button'

const Header = () => {
    return (
        <>
            <Container fluid id='header'>
                <Row className='m-0'>
                    <Col id='logo' className='d-none d-sm-block'>
                        <Link to="/">
                            <img src='./images/android-icon-48x48.png' alt='Spartan Protocol Icon' className='m-4 text-center' />
                        </Link>
                    </Col>
                    <Col id='logo-mobile' className='d-block d-sm-none'>
                        <Link to="/">
                            <img src='./images/android-icon-36x36.png' alt='Spartan Protocol Mobile Icon' className='m-2 text-center' />
                        </Link>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <Button variant="dark" className='mx-1'><i className='bi bi-house-fill' /></Button>
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-cloud-plus-fill' /><div className='d-none d-sm-inline-block ml-1'>Pools</div></Button>
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-people-fill' /><div className='d-none d-sm-inline-block ml-1'>DAO</div></Button>
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-info-circle' /><div className='d-none d-sm-inline-block ml-1'>Info</div></Button>
                    </Col>
                    <Col className='header-section'>
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-file-code-fill' /></Button>
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-sun' /></Button>
                        {/* ICON BASED ON WALLET TYPE (METAMASK/TRUST ETC) */}
                        <Button variant="dark" className='mx-1'><bi className='bi-lg bi-wallet-fill' /></Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Header