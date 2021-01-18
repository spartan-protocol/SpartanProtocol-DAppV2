import React from "react"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Navbar = () => {
    return (
        <>
            <Container id='navbar'>
                <Row>
                    <Col>
                        Home
                    </Col>
                    <Col>
                        Pools<br/>
                        - Bond<br/>
                        - Liquidity<br/>
                        - Positions<br/>
                        - Swap<br/>
                    </Col>
                    <Col>
                        Dao
                        - Lock<br/>
                        - Propose<br/>
                    </Col>
                    <Col>
                        Info
                        - Dashboard<br/>
                        - FAQ<br/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Navbar