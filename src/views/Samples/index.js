import React from "react"
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Card from 'react-bootstrap/Card'

const Samples = () => {
    return (
        <>
            <Container className='full-height'>
                <Jumbotron>
                    <h1>Welcome, Spartans!</h1>
                    <p>
                        Welcome to the Samples page! Please add components / bootstrap elements here to view them!
                        Open the figma mockup and start styling these elements into a nice consistent theme.
                        Reach out in the channels with/for ideas.
                    </p>
                </Jumbotron>
                <Card>
                    <Card.Title>
                        Please follow the import structure (one line per bootsrap component import)
                    </Card.Title>
                    <Card.Body>
                            The relevant child elements are accessible without having to import separately
                            (i.e. importing 'Card' will allow for access to Card & Card.Title & Card.Body)
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default Samples