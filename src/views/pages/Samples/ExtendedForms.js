import React from 'react'
// react plugin used to create datetimepicker
// react plugin used to create DropdownMenu for selecting items
import Select from 'react-select'
// plugin that creates slider
import Slider from 'nouislider'

// reactstrap components
import {
  Card,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Progress,
  CustomInput,
  Row,
  Col,
} from 'reactstrap'

// core components

const ExtendedForms = () => {
  const [singleSelect, setsingleSelect] = React.useState(null)
  const [multipleSelect, setmultipleSelect] = React.useState(null)

  const slider1Ref = React.useRef(null)
  const slider2Ref = React.useRef(null)
  React.useEffect(() => {
    const slider1 = slider1Ref.current
    const slider2 = slider2Ref.current
    if (slider1.className === 'slider') {
      Slider.create(slider1, {
        start: [40],
        connect: [true, false],
        step: 1,
        range: { min: 0, max: 100 },
      })
    }
    if (slider2.className === 'slider slider-primary mb-3') {
      Slider.create(slider2, {
        start: [20, 60],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 },
      })
    }
  }, [])

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Row>
                  <Col className="mb-4" md="6">
                    <CardTitle tag="h4">Toggle Buttons</CardTitle>
                    <Row className="mb-3">
                      <Col md="4">
                        <p className="category">With label</p>
                        <CustomInput
                          type="switch"
                          id="switch-3"
                          label="Nice label here"
                        />
                        <br />
                        <CustomInput
                          type="switch"
                          id="switch-4"
                          label="Better label here"
                          defaultChecked
                        />
                      </Col>
                      <Col md="4">
                        <p className="category">With Text</p>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">Left text</span>
                          <CustomInput
                            type="switch"
                            id="switch-5"
                            className="mt-n4"
                          />
                          <span className="ml-n2">Right text</span>
                        </div>
                        <br />
                        <div className="d-flex align-items-center">
                          <span className="mr-2">Left text</span>
                          <CustomInput
                            type="switch"
                            id="switch-6"
                            className="mt-n4"
                            defaultChecked
                          />
                          <span className="ml-n2">Right text</span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="mb-4" md="6">
                    <CardTitle tag="h4">Customisable Select</CardTitle>
                    <Row>
                      <Col lg="5" md="6" sm="3">
                        <Select
                          className="react-select info"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={singleSelect}
                          onChange={(value) => setsingleSelect(value)}
                          options={[
                            {
                              value: '',
                              label: 'Single Option',
                              isDisabled: true,
                            },
                            { value: '2', label: 'Foobar' },
                            { value: '3', label: 'Is great' },
                          ]}
                          placeholder="Single Select"
                        />
                      </Col>
                      <Col lg="5" md="6" sm="3">
                        <Select
                          className="react-select info"
                          classNamePrefix="react-select"
                          placeholder="Choose City"
                          name="multipleSelect"
                          closeMenuOnSelect={false}
                          isMulti
                          value={multipleSelect}
                          onChange={(value) => setmultipleSelect(value)}
                          options={[
                            {
                              value: '',
                              label: ' Multiple Options',
                              isDisabled: true,
                            },
                            { value: '2', label: 'Paris ' },
                            { value: '3', label: 'Bucharest' },
                            { value: '4', label: 'Rome' },
                            { value: '5', label: 'New York' },
                            { value: '6', label: 'Miami ' },
                            { value: '7', label: 'Piatra Neamt' },
                            { value: '8', label: 'Paris ' },
                            { value: '9', label: 'Bucharest' },
                            { value: '10', label: 'Rome' },
                            { value: '11', label: 'New York' },
                            { value: '12', label: 'Miami ' },
                            { value: '13', label: 'Piatra Neamt' },
                            { value: '14', label: 'Paris ' },
                            { value: '15', label: 'Bucharest' },
                            { value: '16', label: 'Rome' },
                            { value: '17', label: 'New York' },
                            { value: '18', label: 'Miami ' },
                            { value: '19', label: 'Piatra Neamt' },
                          ]}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <CardTitle tag="h4">Dropdown &amp; Dropup</CardTitle>
                    <Row>
                      <Col lg="4" md="6" sm="3">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            aria-expanded={false}
                            aria-haspopup
                            caret
                            className="btn-block"
                            color="primary"
                            data-toggle="dropdown"
                            id="dropdownMenuButton"
                            type="button"
                          >
                            Dropdown
                          </DropdownToggle>
                          <DropdownMenu aria-labelledby="dropdownMenuButton">
                            <DropdownItem header>Dropdown header</DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                      <Col lg="4" md="6" sm="3">
                        <UncontrolledDropdown direction="up">
                          <DropdownToggle
                            caret
                            className="btn-block"
                            color="primary"
                            data-toggle="dropdown"
                            type="button"
                          >
                            Dropup
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Dropdown header</DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-4" md="6">
                    <CardTitle tag="h4">Progress Bars</CardTitle>
                    <div className="progress-container">
                      <span className="progress-badge">Default</span>
                      <Progress max="100" value="25">
                        <span className="progress-value">25%</span>
                      </Progress>
                    </div>
                    <div className="progress-container progress-primary">
                      <span className="progress-badge">Primary</span>
                      <Progress max="100" value="60">
                        <span className="progress-value">60%</span>
                      </Progress>
                    </div>
                  </Col>
                  <Col md="6">
                    <CardTitle className="mt-3" tag="h4">
                      Sliders
                    </CardTitle>
                    <div className="slider" ref={slider1Ref} />
                    <br />
                    <div
                      className="slider slider-primary mb-ImageUpload.3"
                      ref={slider2Ref}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {/* end card */}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ExtendedForms
