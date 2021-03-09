/* eslint-disable react/no-unescaped-entities */
/* eslint-disable global-require */
import React from 'react'

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  CustomInput,
  ListGroupItem,
  ListGroup,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap'

const Widgets = () => (
  <>
    <div className="content">
      <Row>
        <Col className="text-center" lg="6" sm="6">
          <Card className="card-tasks text-left">
            <CardHeader>
              <h6 className="title d-inline">Tasks(5)</h6>
              <p className="card-category d-inline">Today</p>
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  className="btn-icon"
                  color="link"
                  data-toggle="dropdown"
                  type="button"
                >
                  <i className="bd-icons icon-settings-gear-63" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem href="#" onClick={(e) => e.preventDefault()}>
                    Action
                  </DropdownItem>
                  <DropdownItem href="#" onClick={(e) => e.preventDefault()}>
                    Another action
                  </DropdownItem>
                  <DropdownItem href="#" onClick={(e) => e.preventDefault()}>
                    Something else here
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </CardHeader>
            <CardBody>
              <div className="table-responsive table-full-width">
                <Table>
                  <tbody>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input defaultValue="" type="checkbox" />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">Update the Documentation</p>
                        <p className="text-muted">
                          Dwuamish Head, Seattle, WA 8:47 AM
                        </p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip170482171"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip170482171"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input
                              defaultChecked
                              defaultValue=""
                              type="checkbox"
                            />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">GDPR Compliance</p>
                        <p className="text-muted">
                          Alki Ave SW, Seattle, WA 98116, SUA 12:29 PM
                        </p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip720626938"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip720626938"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input defaultValue="" type="checkbox" />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">Export the processed files</p>
                        <p className="text-muted">
                          Capitol Hill, Seattle, WA 12:34 AM
                        </p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip598446371"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip598446371"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input defaultValue="" type="checkbox" />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">Release v2.0.0</p>
                        <p className="text-muted">
                          Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                        </p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip797367748"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip797367748"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input defaultValue="" type="checkbox" />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">Solve the issues</p>
                        <p className="text-muted">Caption Hill, LA 12:34 AM</p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip147107903"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip147107903"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input defaultValue="" type="checkbox" />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>
                        <p className="title">Arival at export process</p>
                        <p className="text-muted">
                          Capitol Hill, Seattle, WA 12:34 AM
                        </p>
                      </td>
                      <td className="td-actions text-right">
                        <Button
                          color="link"
                          id="tooltip841399405"
                          title=""
                          type="button"
                        >
                          <i className="bd-icons icon-settings" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip841399405"
                        >
                          Edit Task
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
          <Card className="card-contributions">
            <CardBody>
              <CardTitle tag="h1">6,332</CardTitle>
              <h3 className="card-category">Total Public Contributions</h3>
              <p className="card-description">
                After a very successful two-year run, we’re going to be changing
                the way that contributions work.
              </p>
            </CardBody>
            <hr />
            <CardFooter>
              <Row>
                <Col className="ml-auto mr-auto" lg="6" md="8">
                  <div className="card-stats justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="mr-2">Off</span>
                      <CustomInput
                        type="switch"
                        id="switch-1"
                        defaultChecked
                        className="mt-n4"
                      />
                      <span className="ml-n4">On</span>
                    </div>
                    <span>All public contributions</span>
                  </div>
                </Col>
                <Col className="ml-auto mr-auto" lg="6" md="8">
                  <div className="card-stats justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="mr-2">Off</span>
                      <CustomInput
                        type="switch"
                        id="switch-2"
                        className="mt-n4"
                      />
                      <span className="ml-n4">On</span>
                    </div>
                    <span>Past week contributions</span>
                  </div>
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="6" sm="6">
          <Card className="card-timeline card-plain">
            <CardBody>
              <ul className="timeline timeline-simple">
                <li className="timeline-inverted">
                  <div className="timeline-badge danger">
                    <i className="bd-icons icon-bag-16" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <Badge color="danger">Some Title</Badge>
                    </div>
                    <div className="timeline-body">
                      <p>
                        Wifey made the best Father's Day meal ever. So thankful
                        so happy so blessed. Thank you for making my family We
                        just had fun with the “future” theme !!! It was a fun
                        night all together ... The always rude Kanye Show at 2am
                        Sold Out Famous viewing @ Figueroa and 12th in downtown.
                      </p>
                    </div>
                    <h6>
                      <i className="ti-time" />
                      11 hours ago via Twitter
                    </h6>
                  </div>
                </li>
                <li className="timeline-inverted">
                  <div className="timeline-badge success">
                    <i className="bd-icons icon-gift-2" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <Badge color="success">Another One</Badge>
                    </div>
                    <div className="timeline-body">
                      <p>
                        Thank God for the support of my wife and real friends. I
                        also wanted to point out that it’s the first album to go
                        number 1 off of streaming!!! I love you Ellen and also
                        my number one design rule of anything I do from shoes to
                        music to homes is that Kim has to like it....
                      </p>
                    </div>
                  </div>
                </li>
                <li className="timeline-inverted">
                  <div className="timeline-badge info">
                    <i className="bd-icons icon-planet" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <Badge color="info">Another Title</Badge>
                    </div>
                    <div className="timeline-body">
                      <p>
                        Called I Miss the Old Kanye That’s all it was Kanye And
                        I love you like Kanye loves Kanye Famous viewing @
                        Figueroa and 12th in downtown LA 11:10PM
                      </p>
                      <p>
                        What if Kanye made a song about Kanye Royère doesn't
                        make a Polar bear bed but the Polar bear couch is my
                        favorite piece of furniture we own It wasn’t any Kanyes
                        Set on his goals Kanye
                      </p>
                      <hr />
                    </div>
                    <div className="timeline-footer">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          caret
                          className="btn-round"
                          color="info"
                          data-toggle="dropdown"
                          type="button"
                        >
                          <i className="bd-icons icon-bullet-list-67" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="3" md="6">
          <Card className="card-pricing card-primary card-white">
            <CardBody>
              <CardTitle tag="h1">pro</CardTitle>
              {/* <CardImg
                alt="..."
                src={require('assets/img/card-primary.png').default}
              /> */}
              <ListGroup>
                <ListGroupItem>300 messages</ListGroupItem>
                <ListGroupItem>150 emails</ListGroupItem>
                <ListGroupItem>24/7 Support</ListGroupItem>
              </ListGroup>
              <div className="card-prices">
                <h3 className="text-on-front">
                  <span>$</span>
                  95
                </h3>
                <h5 className="text-on-back">95</h5>
                <p className="plan">Professional plan</p>
              </div>
            </CardBody>
            <CardFooter className="text-center mb-3 mt-3">
              <Button className="btn-round btn-just-icon" color="primary">
                Get started
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card className="card-pricing card-primary">
            <CardBody>
              <CardTitle tag="h1">pro</CardTitle>
              {/* <CardImg
                alt="..."
                src={require('assets/img/card-primary.png').default}
              /> */}
              <ListGroup>
                <ListGroupItem>300 messages</ListGroupItem>
                <ListGroupItem>150 emails</ListGroupItem>
                <ListGroupItem>24/7 Support</ListGroupItem>
              </ListGroup>
              <div className="card-prices">
                <h3 className="text-on-front">
                  <span>$</span>
                  95
                </h3>
                <h5 className="text-on-back">95</h5>
                <p className="plan">Professional plan</p>
              </div>
            </CardBody>
            <CardFooter className="text-center mb-3 mt-3">
              <Button className="btn-round btn-just-icon" color="primary">
                Get started
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="6">
          <Card className="card-testimonial">
            <CardHeader className="card-header-avatar">
              <div
                href="#"
                onClick={(e) => e.preventDefault()}
                onKeyPress={(e) => e.preventDefault()}
                role="button"
                tabIndex="0"
              >
                {/* <img
                  alt="..."
                  className="img img-raised"
                  src={require('assets/img/james.jpg').default}
                /> */}
              </div>
            </CardHeader>
            <CardBody>
              <p className="card-description">
                The networking at Web Summit is like no other European tech
                conference.
              </p>
              <div className="icon icon-primary">
                <i className="fa fa-quote-right" />
              </div>
            </CardBody>
            <CardFooter>
              <CardTitle tag="h4">Robert Priscen</CardTitle>
              <p className="category">@robertpriscen</p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  </>
)

export default Widgets
