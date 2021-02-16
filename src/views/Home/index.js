import React from "react"
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

const Home = () => {
    return (
        <Container className='full-height'>
                <Card>
                    <Card.Body>
                        <h1>Welcome, Spartans!</h1>
                        <p>
                            Welcome to the Spartan Protocol V2 TestNet Experience
                        </p>

                    </Card.Body>
                </Card>
        </Container>
    )
}

export default Home