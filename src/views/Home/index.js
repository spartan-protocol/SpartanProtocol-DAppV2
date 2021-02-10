import React from "react"
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

const Home = () => {
    return (
        <Container className='full-height'>
            <Jumbotron>
                <h1>Welcome, Spartans!</h1>
                <p>
                    Welcome to the Spartan Potocol V2 TestNet Experience!
                </p>
            </Jumbotron>
        </Container>
    )
}

export default Home