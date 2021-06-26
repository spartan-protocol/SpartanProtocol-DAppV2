import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Form, Nav, Row } from 'react-bootstrap'
import { getAddresses, getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool/selector'
import EmptyPools from './EmptyPools'

const Overview = () => {
  const pool = usePool()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('overview')

  const [selectedAsset, setselectedAsset] = useState('')
  const emptyPools = pool.poolDetails?.filter(
    (asset) => asset.hide && asset.tokenAddress !== addr.spartav1,
  )

  const getToken = (tokenAddress) =>
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
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 me-3">Power User</h2>
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Col xs="12" className="mb-3">
                <Nav className="card-480" activeKey={activeTab}>
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
                </Nav>
              </Col>

              {activeTab === 'overview' && (
                <Col xs="12">
                  <Card className="card-480">
                    <Card.Header>Empty Pools</Card.Header>
                    <Card.Body>
                      There are {emptyPools?.length} pool(s) that have been
                      created but have no depth. Add the initial liquidty to set
                      the ratio of TOKEN:SPARTA for:
                      {emptyPools.map((asset) => (
                        <Form className="my-2" key={asset.tokenAddress}>
                          <Form.Check
                            id={asset.tokenAddress}
                            type="radio"
                            label={`${
                              getToken(asset.tokenAddress)?.symbol
                            }:SPARTA`}
                            onClick={() => setselectedAsset(asset.tokenAddress)}
                            checked={selectedAsset === asset.tokenAddress}
                            readOnly
                          />
                        </Form>
                      ))}
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        className="w-100"
                        onClick={() => setActiveTab('emptyPools')}
                        disabled={!selectedAsset}
                      >
                        Add {getToken(selectedAsset)?.symbol}:SPARTA
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              )}
              {activeTab === 'emptyPools' && (
                <EmptyPools selectedAsset={selectedAsset} />
              )}
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
