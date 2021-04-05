import React from 'react'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col,
} from 'reactstrap'

const Tabs = () => {
  const [horizontalTabs, sethorizontalTabs] = React.useState('profile')

  // with this function we change the active tab for all the tabs in this page
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    switch (tabState) {
      case 'horizontalTabs':
        sethorizontalTabs(tabName)
        break
      // case 'verticalTabsIcons':
      //   setverticalTabsIcons(tabName)
      //   break
      // case 'pageTabs':
      //   setpageTabs(tabName)
      //   break
      // case 'verticalTabs':
      //   setverticalTabs(tabName)
      //   break
      default:
        break
    }
  }
  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <h5 className="card-category">Navigation Pills</h5>
                <CardTitle tag="h3">Horizontal Tabs</CardTitle>
              </CardHeader>
              <CardBody>
                <Nav className="nav-tabs-custom" pills>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#pablo"
                      className={horizontalTabs === 'profile' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'profile')
                      }
                    >
                      Profile
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#pablo"
                      className={horizontalTabs === 'settings' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'settings')
                      }
                    >
                      Settings
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#pablo"
                      className={horizontalTabs === 'options' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'options')
                      }
                    >
                      Options
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="tab-space" activeTab={horizontalTabs}>
                  <TabPane tabId="profile">
                    Collaboratively administrate empowered markets via
                    plug-and-play networks. Dynamically procrastinate B2C users
                    after installed base benefits. <br />
                    <br />
                    Dramatically visualize customer directed convergence without
                    revolutionary ROI.
                  </TabPane>
                  <TabPane tabId="settings">
                    Efficiently unleash cross-media information without
                    cross-media value. Quickly maximize timely deliverables for
                    real-time schemas. <br />
                    <br />
                    Dramatically maintain clicks-and-mortar solutions without
                    functional solutions.
                  </TabPane>
                  <TabPane tabId="options">
                    Completely synergize resource taxing relationships via
                    premier niche markets. Professionally cultivate one-to-one
                    customer service with robust ideas. <br />
                    <br />
                    Dynamically innovate resource-leveling customer service for
                    state of the art customer service.
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Tabs
