/* eslint-disable */
import React, { useState } from "react"


import {
  Button,
  Modal,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText, UncontrolledPopover, PopoverHeader, PopoverBody, Progress, Collapse
} from "reactstrap"
import classnames from "classnames"
import IconLogo from "../../assets/icons/coin_sparta_black_bg.svg"
import ShareLink from "../Share/ShareLink"
import { watchAsset } from "../../store/web3"
import MetaMask from "../../assets/icons/MetaMask.svg"
import { formatFromWei } from "../../utils/bigNumber"
import { getExplorerContract, getExplorerWallet } from "../../utils/extCalls"
import Popover from "bootstrap/js/src/popover"
import Container from "react-bootstrap/Container"
import bnbSparta from "../../assets/icons/bnb_sparta.png"
import { useWeb3 } from '../../store/web3'

const Supply = () => {
  const web3 = useWeb3()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)


  return (
    <>

      <Button
        id="PopoverClick"
        type="Button"
        className="mx-2 btn btn-primary px-4 py-2"
        href="#"
      >
        <img
          className="mr-1"
          src={IconLogo}
          height="25px"
          alt="share icon"
        />{' '}
        ${web3.spartaPrice}
      </Button>

      <UncontrolledPopover trigger="click" placement="bottom" target="PopoverClick">
        <PopoverHeader className="mt-2">Tokenomics</PopoverHeader>
        <PopoverBody>
          <Row>
            <Col xs="6" className="popover-text mb-4">
              Market cap
            </Col>
            <Col xs="6 mb-2" className="popover-text mb-4">
              $109,862,776
            </Col>
            <Col xs="6 mb-2" className="popover-text">
              Circulating supply
            </Col>

            <Col xs="6 mb-2" className="popover-text">
              52,701,217
            </Col>
            <Col xs="12 mb-2">
              <div className="progress-container progress-info">
                <span className="progress-badge" />
                <Progress max="100" value="60" />
              </div>
            </Col>

            <Col xs="6" className="popover-text mb-2">
              Total supply
            </Col>
            <Col xs="6" className="popover-text mb-2">
              64,777,521
            </Col>
            <Col xs="12 mb-2"> <Progress multi>
              <Progress bar color="primary" value="30" />
              <Progress bar color="black" value="2" />
              <Progress bar color="yellow" value="6" />
              <Progress bar color="black" value="2" />
              <Progress bar color="lightblue" value="10" />
            </Progress>
            </Col>
            <Col xs="4">
              <span className="dot-burn mr-2"></span>Burn
            </Col>
            <Col xs="4">
              <span className="dot-bond mr-1"></span>Bond
            </Col>
            <Col xs="4">
              <span className="dot-emission mr-2"></span>Emisson
            </Col>
          </Row>
          <br />
          <br />
          <Row>

            <Col md="12" className="ml-auto text-right">
              <Card className="card-body" style={{ backgroundColor: "#25212D" }}>
                <Row>

                  <Col xs={8} className="ml-n2 ">
                    <div className="text-left text-card"><i
                      className="icon-small icon-contracts icon-light mr-1" /> Select contracts
                    </div>
                  </Col>
                  <Col className="ml-auto">
                    <div
                      aria-expanded={openedCollapseThree}
                      role="button"
                      tabIndex={-1}
                      data-parent="#accordion"
                      data-toggle="collapse"
                      onClick={(e) => {
                        e.preventDefault()
                        setopenedCollapseThree(!openedCollapseThree)
                      }}
                      onKeyPress={(e) => {
                        e.preventDefault()
                        setopenedCollapseThree(!openedCollapseThree)
                      }}
                    >
                      <i
                        className="bd-icons icon-minimal-down mt-1"
                        style={{ color: "#FFF" }}
                      />
                    </div>
                  </Col>


                </Row>


                <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                  <Row className="card-body text-center">
                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">$SPARTA</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">UTILS</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">DAO</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">ROUTER</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">BONDv2</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>
                    <Col xs={12} className="text-left mb-4">
                       <span>
                        <div className="text-card">BONDv3</div> View on BSC Scan{" "}
                         <a
                           href="#"
                           target="_blank"
                           rel="noreferrer"
                         >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>


                  </Row>
                </Collapse>
              </Card>
            </Col>


          </Row>
        </PopoverBody>

      </UncontrolledPopover>

    </>
  )
}

export default Supply
