import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Form, Nav, Row } from 'react-bootstrap'
import { getAddresses, getNetwork, tempChains } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool/selector'
import EmptyPools from './EmptyPools'
import PoolStatus from './FrozenPools'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useWeb3 } from '../../../store/web3'

const Overview = () => {
  const pool = usePool()
  const web3 = useWeb3()
  const addr = getAddresses()

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedAsset, setselectedAsset] = useState('')

  const isLoading = () => {
    if (!pool.poolDetails || !pool.tokenDetails) {
      return true
    }
    return false
  }

  const emptyPools = !isLoading
    ? pool.poolDetails?.filter(
        (asset) => asset.hide && asset.tokenAddress !== addr.spartav1,
      )
    : []
  const frozenPools = !isLoading
    ? pool.poolDetails?.filter((asset) => asset.frozen)
    : []

  const getToken = (tokenAddress) =>
    !isLoading &&
    pool.tokenDetails.filter((asset) => asset.address === tokenAddress)[0]

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
        {!isLoading() ? (
          tempChains.includes(network.chainId) && (
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
                  </Nav>
                </Col>
              </Row>
              <Row className="row-480">
                {activeTab === 'overview' && (
                  <>
                    <Col xs="auto">
                      <Card className="card-480">
                        <Card.Header>Ratio-Check Pools</Card.Header>
                        <Card.Body>
                          <li>
                            {frozenPools?.length} pool(s) have triggered a
                            warning
                          </li>
                          <li>
                            Ensure their ratios match the external markets.
                          </li>
                          <li>
                            It may take some time for the ratios to repair
                            themselves.
                          </li>
                        </Card.Body>
                        <Card.Footer>
                          <Button
                            className="w-100"
                            onClick={() => setActiveTab('pools')}
                            disabled={!selectedAsset}
                          >
                            View Pool Status
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                    <Col xs="auto">
                      <Card className="card-480">
                        <Card.Header>Empty Pools</Card.Header>
                        <Card.Body>
                          There are {emptyPools?.length} pool(s) that have been
                          created but have no depth. Add the initial liquidty to
                          set the ratio of TOKEN:SPARTA for:
                          {emptyPools.map((asset) => (
                            <Form className="my-2" key={asset.tokenAddress}>
                              <Form.Check
                                id={asset.tokenAddress}
                                type="radio"
                                label={`${
                                  getToken(asset.tokenAddress)?.symbol
                                }:SPARTA`}
                                onClick={() =>
                                  setselectedAsset(asset.tokenAddress)
                                }
                                checked={selectedAsset === asset.tokenAddress}
                                readOnly
                              />
                            </Form>
                          ))}
                        </Card.Body>
                        {emptyPools?.length > 0 && (
                          <Card.Footer>
                            <Button
                              className="w-100"
                              onClick={() => setActiveTab('emptyPools')}
                              disabled={!selectedAsset}
                            >
                              Add {getToken(selectedAsset)?.symbol}:SPARTA
                            </Button>
                          </Card.Footer>
                        )}
                      </Card>
                    </Col>
                    <Col xs="auto">
                      <Card className="card-480">
                        <Card.Header>Status of RPCs</Card.Header>
                        <Card.Body>
                          {web3.rpcs.map((x) => (
                            <Row key={x.url}>
                              <Col>
                                {x.url} {x.block} {x.good ? 'OKAY!' : 'BAD!'}
                              </Col>
                            </Row>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </>
                )}
                {activeTab === 'pools' && <PoolStatus />}
                {activeTab === 'emptyPools' && (
                  <EmptyPools selectedAsset={selectedAsset} />
                )}
              </Row>
            </>
          )
        ) : (
          <Col className="card-480">
            <HelmetLoading height={300} width={300} />
          </Col>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
