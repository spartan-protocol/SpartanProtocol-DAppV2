import React from "react"
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardHeader from "reactstrap/es/CardHeader";
import CardTitle from "reactstrap/es/CardTitle";
import CardBody from "reactstrap/es/CardBody";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import PaginationItem from "reactstrap/es/PaginationItem";
import PaginationLink from "reactstrap/es/PaginationLink";
import ButtonGroup from "react-bootstrap/ButtonGroup";


const Samples = () => {
    return (
        <>
            <Container className='full-height'>
                <br/>
                <Card>
                    <CardBody>
                        <h1>Welcome, Spartans!</h1>
                        <p>
                            Welcome to the Samples page! Please add components / bootstrap elements here to view them!
                            Open the figma mockup and start styling these elements into a nice consistent theme.
                            Reach out in the channels with/for ideas.<br/><br/>

                            Please follow the import structure (one line per bootsrap component import)
                            The relevant child elements are accessible without having to import separately
                            (i.e. importing 'Card' will allow for access to Card & Card.Title & Card.Body)
                        </p>

                    </CardBody>
                </Card>
                <Card>
                    <Row>
                        <Col md="12">
                            <CardBody>
                                <h1>Colors</h1>
                                <h2>Base Colors</h2>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" rx="12" fill="#0A0001"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#1D171F"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#25212D"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#403A4B"/>
                                </svg>

                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#605E68"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#F5F8FC"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#FFFFFF"/>
                                </svg>
                            </CardBody>
                        </Col>
                        <Col md="12">
                            <CardBody>
                                <h2>Primary Colors</h2>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" rx="12" fill="#FB2715"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#FC5D50"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#FD938A"/>
                                </svg>
                            </CardBody>
                        </Col>

                        <Col md="12">
                            <CardBody>
                                <h2>Secondary Colors</h2>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" rx="12" fill="#AACDFF"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#C0DAFF"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#D5E6FF"/>
                                </svg>
                            </CardBody>
                        </Col>
                        <Col md="12">
                            <CardBody>
                                <h2>Acent Colors</h2>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" rx="12" fill="#F5BC17"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#D4630D"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#B70000"/>
                                </svg>
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                        fill="#1A68FF"/>
                                </svg>
                            </CardBody>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col md="6">
                            <CardBody>
                                <h1>Typogragraphy</h1>
                                <h1>Headline 1</h1>
                                <h2>Headline 2</h2>
                                <h3>Headline 3</h3>
                                <h4>Headline 4</h4>
                                <h5>Headline 5</h5>
                                <h6>Headline 6</h6>
                                <p>Body</p>
                            </CardBody>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col md="6">
                            <CardHeader>
                                <h1>Buttons</h1>
                                <CardTitle tag="h4">Primary</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Button type="Button" className="mx-1 btn btn-primary">
                                    <div className="d-none d-sm-inline-block ml-1">Primary</div>
                                </Button>
                                <Button type="Button" className="mx-1 btn btn-warning">
                                    <div className="d-none d-sm-inline-block ml-1">Pressed</div>
                                </Button>
                                <Button type="Button" className="mx-1 btn btn-danger">
                                    <div className="d-none d-sm-inline-block ml-1">Disabled</div>
                                </Button>
                                <br/>
                            </CardBody>
                            <CardHeader>
                                <CardTitle tag="h4">Secondary</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Button type="Button" className="mx-1 btn btn-success">
                                    <div className="d-none d-sm-inline-block ml-1">Secondary</div>
                                </Button>
                                <Button type="Button" className="mx-1 btn btn-success">
                                    <div className="d-none d-sm-inline-block ml-1">Pressed</div>
                                </Button>
                                <Button type="Button" className="mx-1 btn btn-danger">
                                    <div className="d-none d-sm-inline-block ml-1">Disabled</div>
                                </Button>
                                <br/>
                            </CardBody>
                        </Col>
                        <Col md="6">
                            <CardHeader>
                                <br/>
                                <br/>
                                <br/>
                                <CardTitle tag="h4">Buttons with Label</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Button color="default">
                                    <i className="bi-lg bi-chevron-compact-left"/> Left
                                </Button>
                                <Button color="default">
                                    Right <i className="bi-lg bi-chevron-compact-right"/>
                                </Button>
                                <Button color="info">
                                    <i className="bi-lg bi-info-circle-fill"/> Info
                                </Button>
                                <br/>
                                <Button color="success">
                                    <i className="bi-lg bi-check"/> Success
                                </Button>
                                <Button color="warning">
                                    <i className="bi-lg bi-exclamation"/> Warning
                                </Button>
                                <Button color="danger">
                                    <i className="bi-lg bi-exclamation-triangle-fill"/> Danger
                                </Button>
                            </CardBody>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <CardHeader>
                                <CardTitle tag="h4">Sizes</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" size="sm">
                                    Small
                                </Button>
                                <Button color="primary">Regular</Button>
                                <Button color="primary" size="lg">
                                    Large
                                </Button>
                            </CardBody>
                        </Col>
                        <Col md="6">
                            <CardHeader>
                                <CardTitle tag="h4">Shapes</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Button color="primary">Default</Button>
                                <Button className="btn-round" color="primary">
                                    round
                                </Button>
                                <Button className="btn-round" color="primary">
                                    <i className="bi-lg bi bi-wallet"/> with icon
                                </Button>
                                <Button className="btn-round btn-icon" color="primary">
                                    <i className="bi-lg bi bi-wallet"/>
                                </Button>
                                <Button className="btn-simple" color="primary">
                                    simple
                                </Button>
                                <Button className="btn-link" color="primary">
                                    link
                                </Button>
                            </CardBody>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <CardHeader>
                                <CardTitle tag="h4">Pagination</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <nav aria-label="Page navigation example">
                                    <Pagination
                                        className="pagination pagination-warning"
                                        listClassName="pagination-warning"
                                    >
                                        <PaginationItem className="active">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                4
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                5
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                    <Pagination>
                                        <PaginationItem>
                                            <PaginationLink
                                                aria-label="Previous"
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                        <span aria-hidden={true}>
                          <i
                              aria-hidden={true}
                              className="bi bi-chevron-double-left"
                          />
                        </span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                aria-label="Next"
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                        <span aria-hidden={true}>
                          <i
                              aria-hidden={true}
                              className="bi bi-chevron-double-right"
                          />
                        </span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardBody>
                        </Col>
                        <Col md="6">
                            <CardHeader>
                                <CardTitle tag="h4">Button Group</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ButtonGroup>
                                    <Button color="info" type="Button">
                                        Left
                                    </Button>
                                    <Button color="info" type="Button">
                                        Middle
                                    </Button>
                                    <Button color="info" type="Button">
                                        Right
                                    </Button>
                                </ButtonGroup>
                                <br/>
                                <br/>
                                <ButtonGroup data-toggle="Buttons">
                                    <Button className="btn-round" color="info" type="Button">
                                        1
                                    </Button>
                                    <Button className="btn-round" color="info" type="Button">
                                        2
                                    </Button>
                                    <Button className="btn-round" color="info" type="Button">
                                        3
                                    </Button>
                                    <Button className="btn-round" color="info" type="Button">
                                        4
                                    </Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button className="btn-round" color="info" type="Button">
                                        5
                                    </Button>
                                    <Button className="btn-round" color="info" type="Button">
                                        6
                                    </Button>
                                    <Button className="btn-round" color="info" type="Button">
                                        7
                                    </Button>
                                </ButtonGroup>
                            </CardBody>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <CardHeader>
                                <CardTitle tag="h4">Social Buttons</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="1" sm="1">
                                        <p className="category"></p>
                                        <Button className="btn-icon btn-round" color="success">
                                            <i className="bi bi-twitter"/>
                                        </Button>
                                    </Col>
                                    <Col md="1" sm="1">
                                        <p className="category"></p>
                                        <Button className="btn-icon btn-round" color="twitter">
                                            <i className="bi bi-github"/>
                                        </Button>
                                    </Col>
                                    <Col md="1" sm="1">
                                        <p className="category"></p>
                                        <Button className="btn-icon btn-round" color="twitter">
                                            <i className="bi bi"/>
                                        </Button>
                                    </Col>
                                    <Col md="1" sm="1">
                                        <p className="category"></p>
                                        <Button className="btn-icon btn-round" color="twitter">
                                            <i className="bi bi-github"/>
                                        </Button>
                                    </Col>
                                    <Col md="1" sm="1">
                                        <p className="category"></p>
                                        <Button className="btn-icon btn-round" color="twitter">
                                            <i className="bi bi-github"/>
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </>
    )
}

export default Samples
