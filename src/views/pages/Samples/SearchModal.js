/* eslint-disable */
import React, { useState } from "react"
import classNames from "classnames";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button, NavItem, NavLink, Nav
} from "reactstrap"

import ReactTable from "../../../components/SearchModal/SearchModal";
import classnames from "classnames"
import bnbSparta from "../../../assets/icons/bnb_sparta.png"
import coinSparta from "../../../assets/icons/coin_sparta.svg"
import coinBnb from "../../../assets/icons/coin_bnb.svg"
import btc from "../../../assets/icons/BTC.svg"


// const dataTable = [
//
//   ["BNB", "125.84"],
//   ["SPARTA", "125.84"],
//   ["BNB-SPARTA LP", "125.84"],
//   ["BTC", "125.84"],
//   ["DAI", "125.84"],
//
// ];

const dataTable = [

  [<div><img className="mr-2" src={coinBnb} alt="BNB" />BNB</div>, "125.84"],
  [<div><img  className="mr-2" src={coinSparta} alt="BNB" />SPARTA</div>, "125.84"],
  [<div><img height="25" width="38" className="mr-2" src={bnbSparta} alt="BNB" />BNB-SPARTA LP</div>, "125.84"],
  [<div><img height="25" width="25"className="mr-2" src={btc} alt="BNB" />BTC</div>, "125.84"],
  [<div><img className="mr-2" src={coinBnb} alt="DAI" />DAI</div>, "125.84"],

];



const SeachModal = () => {
  const [data, setData] = React.useState(
    dataTable.map((prop, key) => {
      return {
        id: key,
        token: prop[0],
        balance: prop[1],
      };
    })
  );

  const [activeTab, setActiveTab] = useState("1")

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }



  return (
    <>
      <div className="content">
        <Row className="mt-5">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h2">Select a token</CardTitle>
              </CardHeader>
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1")
                    }}
                  >
                    <span className="d-none d-sm-block">All</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2")
                    }}
                  >
                    <span className="d-none d-sm-block">Tokens</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggle("3")
                    }}
                  >
                    <span className="d-none d-sm-block">LP Tokens</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "4" })}
                    onClick={() => {
                      toggle("4")
                    }}
                  >
                    <span className="d-none d-sm-block">Synths</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <CardBody>
                <ReactTable
                  data={data}
                  filterable
                  resizable={false}
                  columns={[
                    {
                       // Header: "Token",
                      accessor: "token",
                    },
                    {
                       // Header: "Balance",
                      accessor: "balance",
                    },

                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SeachModal;
