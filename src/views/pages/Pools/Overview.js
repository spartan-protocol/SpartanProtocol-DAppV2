/* eslint-disable */

import React, { useState } from "react"
import {
  CardText,
  Breadcrumb,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane, Alert, UncontrolledAlert
} from "reactstrap"

import classnames from "classnames"
import PoolsTable from "../PoolsTable"
import CardHeader from "reactstrap/es/CardHeader"
import Card from "react-bootstrap/Card"
import CardBody from "reactstrap/es/CardBody"
import { Line } from "react-chartjs-2"
import CardTitle from "reactstrap/es/CardTitle"

const Overview = () => {

  const [customActiveTab, setCustomActiveTab] = useState("1")


  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab)
    }
  }
  const chartTotalVolume = {
    data: (canvas) => {
      let ctx = canvas.getContext("2d")
      var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)

      gradientStroke.addColorStop(0.8, "rgb(44,41,45)")
      return {
        labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        datasets: [
          {
            label: "Data",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#fb2715",
            borderWidth: 3,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#fb2715",
            pointBorderColor: "rgba(0,0,0,0)",
            pointHoverBackgroundColor: "#fb2715",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 0,
            data: [100582485, 120588485, 125588485, 128588485, 140582485, 160582485]
          }
        ]
      }
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: -60,
              fontColor: "#1D171F"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: true,
              color: "#2C292D",
              zeroLineColor: "#2C292D"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    }
  }


  const chartTotalPooled = {
    data: (canvas) => {
      let ctx = canvas.getContext("2d")
      var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)

      gradientStroke.addColorStop(0.8, "rgb(44,41,45)")
      return {
        labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        datasets: [
          {
            label: "Data",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#fb2715",
            borderWidth: 3,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#fb2715",
            pointBorderColor: "rgba(0,0,0,0)",
            pointHoverBackgroundColor: "#fb2715",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 0,
            data: [612758, 512758, 712758, 812758, 912758, 1212758]
          }
        ]
      }
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: -60,
              fontColor: "#1D171F"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: true,
              color: "#2C292D",
              zeroLineColor: "#2C292D"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    }
  }


  return (
    <>
      <div className="content">
        <Row>
          <Col md={1}>
            <Breadcrumb>Pools</Breadcrumb>
          </Col>
          <Col md={8} sm={12} className="float-left mt-3" >
            <UncontrolledAlert
              className="alert-with-icon"
              color="danger"
              fade={false}
            >
                      <span
                        data-notify="icon"
                        className="icon-small icon-info icon-dark"
                      />
              <span data-notify="message" className="ml-n2">The liquidity pools are facilitated by an automated-market-maker (AMM) algorithm with liquidity-sensitive fees.</span>
            </UncontrolledAlert>
          </Col>

        </Row>

        <Row className="card-body">
          <Col md>
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Monthly</h5>
                <CardTitle tag="h3">
                  <Row>
                    <Col>
                      <div className="text-left">Total volume</div>
                    </Col>
                    <Col className="text-right">
                      <div className="subtitle-amount  d-inline">138.582.485</div>
                      <div className="accent ml-1 d-inline">SPARTA</div>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartTotalVolume.data}
                    options={chartTotalVolume.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Monthly</h5>
                <CardTitle tag="h3">
                  <Row>
                    <Col>
                      <div className="text-left">Total pooled</div>
                    </Col>
                    <Col className="text-right">
                      <div className="subtitle-amount  d-inline">$6.127.587</div>
                      <div className="accent ml-1 d-inline">USD</div>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartTotalPooled.data}
                    options={chartTotalPooled.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Nav className="nav-tabs-custom card-body" pills>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTab === "1"
                  })}
                  onClick={() => {
                    toggleCustom("1")
                  }}
                >
                  Pools overview
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTab === "2"
                  })}
                  onClick={() => {
                    toggleCustom("2")
                  }}
                >
                  Positions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTab === "3"
                  })}
                  onClick={() => {
                    toggleCustom("3")
                  }}
                >
                  <span className="d-none d-sm-block">Analysis</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTab === "4"
                  })}
                  onClick={() => {
                    toggleCustom("4")
                  }}
                >
                  Pairs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTab === "5"
                  })}
                  onClick={() => {
                    toggleCustom("5")
                  }}
                >
                  Tokens
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={customActiveTab}>
              <TabPane tabId="1" className="p-3">
                <PoolsTable />
              </TabPane>
              <TabPane tabId="2" className="p-3" />
              <TabPane tabId="3" className="p-3" />
              <TabPane tabId="4" className="p-3" />
              <TabPane tabId="5" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>X</CardText>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="6" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>X</CardText>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview
