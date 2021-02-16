import React from "react"
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Pools = () => {
    return (
        <Container className='full-height'>
            <Card>
                <Card.Title>Welcome, Spartans!</Card.Title>
                <Card.Body>Welcome to the Pools Page!</Card.Body>
            </Card>
            <Card>
                <Card.Title>ROUTER FUNCTIONS DASHBOARD</Card.Title>
                <Row>
                    <Col xs="12">
                        <Card.Body>Welcome to the Pools Page!</Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    )
}

export default Pools