import React from "react"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Sidebar = () => {
    return (
        <>
            <Container id='sidebar'>
                <Row>
                    <Col xs='6'>
                        Sidebar
                    </Col>
                    <Col xs='6'>
                        Close
                    </Col>
                    <Col xs='12'>
                        Tab1 / Tab2
                    </Col>
                    <Col xs='12'>
                        Table
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Sidebar