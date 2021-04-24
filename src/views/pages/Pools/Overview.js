import React, { useState } from 'react'
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'

import classnames from 'classnames'
import CardHeader from 'reactstrap/es/CardHeader'
import Card from 'react-bootstrap/Card'
import CardBody from 'reactstrap/es/CardBody'
import { Line } from 'react-chartjs-2'
import CardTitle from 'reactstrap/es/CardTitle'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import Alert from 'react-bootstrap/Alert'
import { useTranslation } from 'react-i18next'
import PoolsTable from './PoolsTable'

const Overview = () => {
  const { t } = useTranslation()
  const [customActiveTab, setCustomActiveTab] = useState('1')

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab)
    }
  }
  const chartTotalVolume = {
    data: (canvas) => {
      const ctx = canvas.getContext('2d')
      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)

      gradientStroke.addColorStop(0.8, 'rgb(44,41,45)')
      return {
        labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
          {
            label: 'Data',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#fb2715',
            borderWidth: 3,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#fb2715',
            pointBorderColor: 'rgba(0,0,0,0)',
            pointHoverBackgroundColor: '#fb2715',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 0,
            data: [
              100582485,
              120588485,
              125588485,
              128588485,
              140582485,
              160582485,
            ],
          },
        ],
      }
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: 'transparent',
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: -60,
              fontColor: '#1D171F',
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: true,
              color: '#1D171F',
              zeroLineColor: '#1D171F',
            },
            ticks: {
              padding: -10,
              fontColor: '#1D171F',
            },
          },
        ],
      },
    },
  }

  const chartTotalPooled = {
    data: (canvas) => {
      const ctx = canvas.getContext('2d')
      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)

      gradientStroke.addColorStop(0.8, 'rgb(44,41,45)')
      return {
        labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
          {
            label: 'Data',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#fb2715',
            borderWidth: 3,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#fb2715',
            pointBorderColor: 'rgba(0,0,0,0)',
            pointHoverBackgroundColor: '#fb2715',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 0,
            data: [412758, 512758, 712758, 812758, 912758, 1212758],
          },
        ],
      }
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: 'transparent',
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: -60,
              fontColor: '#1D171F',
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: true,
              color: '#1D171F',
              zeroLineColor: '#1D171F',
            },
            ticks: {
              padding: -10,
              fontColor: '#1D171F',
            },
          },
        ],
      },
    },
  }

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">{t('pools')}</h2>
          </Col>
          <Col xs="6" xl="4">
            {/* Buttons? */}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row className="card-body">
              <Col>
                <Alert className="alert-with-icon" color="danger" fade="false">
                  <span
                    data-notify="icon"
                    className="icon-small icon-info icon-dark"
                  />
                  <span data-notify="message" className="ml-n2">
                    {t(
                      'The liquidity pools are facilitated by an automated-market-maker (AMM) algorithm with liquidity-sensitive fees.',
                    )}
                  </span>
                </Alert>
              </Col>
            </Row>
            <Row className="card-body">
              <Col md={6} sm={12}>
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle tag="h2">
                      <Row className="fade-in">
                        <Col md={12} sm={12}>
                          Total pooled
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            The quantity of & SPARTA you are adding to the pool.
                          </UncontrolledTooltip>
                        </Col>

                        <Col md={12} sm={12} className="ml-auto">
                          <div
                            className="subtitle-amount  d-inline"
                            style={{ fontSize: 22 }}
                          >
                            138.582.485
                          </div>
                          <div className="accent ml-1 d-inline">SPARTA</div>
                        </Col>
                      </Row>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div
                      className="chart-area"
                      style={{ pointerEvents: 'none' }}
                    >
                      <Line
                        style={{ pointerEvents: 'none' }}
                        data={chartTotalVolume.data}
                        options={chartTotalVolume.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} sm={12}>
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle tag="h2">
                      <Row className="fade-in">
                        <Col md={12} sm={12}>
                          Total volume
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            The quantity of & SPARTA you are adding to the pool.
                          </UncontrolledTooltip>
                        </Col>

                        <Col md={12} sm={12} className="ml-auto">
                          <div
                            className="subtitle-amount  d-inline"
                            style={{ fontSize: 22 }}
                          >
                            $6.127.587
                          </div>
                          <div className="accent ml-1 d-inline">USD</div>
                        </Col>
                      </Row>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div
                      className="chart-area"
                      style={{ pointerEvents: 'none' }}
                    >
                      <Line
                        style={{ pointerEvents: 'none' }}
                        data={chartTotalPooled.data}
                        options={chartTotalPooled.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Nav className="nav-tabs-custom card-body" pills>
                  <NavItem>
                    <NavLink
                      style={{ cursor: 'pointer' }}
                      className={classnames({
                        active: customActiveTab === '1',
                      })}
                      onClick={() => {
                        toggleCustom('1')
                      }}
                    >
                      Pools
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: 'pointer' }}
                      className={classnames({
                        active: customActiveTab === '2',
                      })}
                      onClick={() => {
                        toggleCustom('2')
                      }}
                    >
                      Positions
                    </NavLink>
                  </NavItem>
                  {/* <NavItem> */}
                  {/*  <NavLink */}
                  {/*    style={{ cursor: "pointer" }} */}
                  {/*    className={classnames({ */}
                  {/*      active: customActiveTab === "3" */}
                  {/*    })} */}
                  {/*    onClick={() => { */}
                  {/*      toggleCustom("3") */}
                  {/*    }} */}
                  {/*  > */}
                  {/*    <span className="d-none d-sm-block">Analysis</span> */}
                  {/*  </NavLink> */}
                  {/* </NavItem> */}
                  {/* <NavItem> */}
                  {/*  <NavLink */}
                  {/*    style={{ cursor: "pointer" }} */}
                  {/*    className={classnames({ */}
                  {/*      active: customActiveTab === "4" */}
                  {/*    })} */}
                  {/*    onClick={() => { */}
                  {/*      toggleCustom("4") */}
                  {/*    }} */}
                  {/*  > */}
                  {/*    Pairs */}
                  {/*  </NavLink> */}
                  {/* </NavItem> */}
                  {/* <NavItem> */}
                  {/*  <NavLink */}
                  {/*    style={{ cursor: "pointer" }} */}
                  {/*    className={classnames({ */}
                  {/*      active: customActiveTab === "5" */}
                  {/*    })} */}
                  {/*    onClick={() => { */}
                  {/*      toggleCustom("5") */}
                  {/*    }} */}
                  {/*  > */}
                  {/*    Tokens */}
                  {/*  </NavLink> */}
                  {/* </NavItem> */}
                </Nav>
                <TabContent activeTab={customActiveTab}>
                  <TabPane tabId="1" className="p-3">
                    <PoolsTable />
                  </TabPane>
                  <TabPane tabId="2" className="p-3" />
                  <TabPane tabId="3" className="p-3" />
                  <TabPane tabId="4" className="p-3" />
                  <TabPane tabId="5" className="p-3" />
                  <TabPane tabId="6" className="p-3" />
                </TabContent>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview
