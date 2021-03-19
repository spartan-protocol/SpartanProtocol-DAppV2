import React from "react"


import coin_bnb from "../../../assets/icons/coin_bnb.svg"
import bnb_sparta from "../../../assets/icons/bnb_sparta.png"

import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Table,
  UncontrolledDropdown, Alert, CardBody, UncontrolledAlert
} from "reactstrap"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import coin_sparta from "../../../assets/icons/coin_sparta.svg"


const PoolsPaneSide = () => {

  return (
    <>
      <h4>Pair details</h4>
      <Row>
        <Table borderless className="ml-2 mr-5">
          <tbody>

          <tr>
            <td>
              <div className="output-card">
                <img
                  className="mr-2"
                  src={coin_bnb}
                  alt="Logo"
                  height="32"
                />BNB

              </div>
            </td>
            <th className="output-card text-right">$260.55</th>
          </tr>
          <tr>
            <td>
              <div className="output-card">
                <img
                  className="mr-2"
                  src={coin_sparta}
                  alt="Logo"
                  height="32"
                />SPARTA

              </div>
            </td>
            <th className="output-card text-right">$1.30</th>
          </tr>
          <tr>
            <td className="text-card">Spot price</td>
            <th className="output-card text-right">178.28 SPARTA</th>
          </tr>
          <tr>
            <td className="text-card">Volume</td>
            <th className="output-card text-right">$261.474.287</th>
          </tr>
          <tr>
            <td className="text-card">Tx count</td>
            <th className="output-card text-right">45.431</th>
          </tr>
          <tr>
            <td className="text-card">Fees</td>
            <th className="output-card text-right">$1.070.836</th>
          </tr>
          <tr>
            <td className="text-card">Depth</td>
            <th className="output-card text-right">48.907 BNB</th>
          </tr>
          <tr>
            <td></td>
            <th className="output-card text-right">9.159.375 SPARTA</th>
          </tr>
          <tr>
            <td className="text-card">
              <div className="text-card">APY{" "}<i
                className="icon-small icon-info icon-dark ml-2"
                id="tooltipAddBase"
                role="button"
              />
                <UncontrolledTooltip
                  placement="right"
                  target="tooltipAddBase">
                  The quantity of & SPARTA you are adding to the
                  pool.
                </UncontrolledTooltip>

              </div>

            </td>
            <th className="output-card text-right">150.39%</th>
          </tr>
          </tbody>
        </Table>

        {/*<Col>*/}

        {/*  <div className="output-card">*/}
        {/*    <img*/}
        {/*      className="mr-2"*/}
        {/*      src={coin_bnb}*/}
        {/*      alt="Logo"*/}
        {/*      height="32"*/}
        {/*    />BNB*/}

        {/*  </div>*/}
        {/*</Col>*/}
        {/*  <Col className="text-right">*/}
        {/*    <div className="output-card">$260.55</div>*/}
        {/*    <div className="output-card">$260.55</div>*/}
        {/*  </Col>*/}
      </Row>

    </>
  )
}

export default PoolsPaneSide
