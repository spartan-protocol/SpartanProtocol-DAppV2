import React, { useState, useEffect } from 'react'
import { Card, Col, Nav, Row } from 'react-bootstrap'
import { getNetwork, tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { usePool } from '../../store/pool/selector'
import PoolStatus from './FrozenPools'
import HelmetLoading from '../../components/Spinner/index'
import { useWeb3 } from '../../store/web3'
import ReserveDetails from './ReserveDetails'
import Others from './Others'

const Overview = () => {
  const pool = usePool()
  const web3 = useWeb3()

  const [activeTab, setActiveTab] = useState('overview')

  const isLoading = () => {
    if (!pool.poolDetails || !pool.tokenDetails) {
      return true
    }
    return false
  }

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            <Row className="row-480">
              <Col>
                <Nav className="card-480 mb-2" activeKey={activeTab}>
                  <Nav.Item key="overview">
                    <Nav.Link
                      eventKey="overview"
                      onClick={() => {
                        setActiveTab('overview')
                      }}
                    >
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="pools">
                    <Nav.Link
                      eventKey="pools"
                      onClick={() => {
                        setActiveTab('pools')
                      }}
                    >
                      Pools
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="reserve">
                    <Nav.Link
                      eventKey="reserve"
                      onClick={() => {
                        setActiveTab('reserve')
                      }}
                    >
                      Reserve
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="others">
                    <Nav.Link
                      eventKey="others"
                      onClick={() => {
                        setActiveTab('others')
                      }}
                    >
                      Others
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row className="row-480">
              {activeTab === 'overview' && (
                <>
                  <Col xs="auto">
                    <Card className="card-480">
                      <Card.Header>Status of RPCs</Card.Header>
                      <Card.Body>
                        {web3?.rpcs ? (
                          web3.rpcs.map((x) => (
                            <Row key={x.url}>
                              <Col>
                                {x.url} {x.block} {x.good ? 'OKAY!' : 'BAD!'}
                              </Col>
                            </Row>
                          ))
                        ) : (
                          <Col className="card-480">
                            <HelmetLoading height={300} width={300} />
                          </Col>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              )}
              {activeTab === 'pools' && !isLoading() && <PoolStatus />}
              {['pools', 'reserve', 'others'].includes(activeTab) &&
                isLoading() && (
                  <Col className="card-480">
                    <HelmetLoading height={300} width={300} />
                  </Col>
                )}
              {activeTab === 'reserve' && !isLoading() && <ReserveDetails />}
              {activeTab === 'others' && !isLoading() && <Others />}
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
