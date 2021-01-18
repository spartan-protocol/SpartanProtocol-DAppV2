import React from "react"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Footer = () => {
    return (
        <>
            <Container id='footer'>
                <Row>
                    <Col xs='6'>
                        A Spartan Community Project
                    </Col>
                    <Col xs='6'>
                        SOCIAL ICONS
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Footer