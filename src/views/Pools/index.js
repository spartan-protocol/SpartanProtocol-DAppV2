import React from "react"
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { BNB_ADDR, getApproval, WBNB_ADDR } from "../../utils/web3"
import { addLiquidityAsym } from "../../utils/web3Router"
import { createPool, CURATED_ADDR } from "../../utils/web3Pools"

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
                        <Card.Body>
                            <Button onClick={() => getApproval(WBNB_ADDR, CURATED_ADDR)}>Approve token</Button>
                            <Button onClick={() => createPool(WBNB_ADDR)}>Test create pool</Button>
                            <Button onClick={() => addLiquidityAsym('1000000000000000000', 0, WBNB_ADDR)}>Test add asym</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    )
}

export default Pools