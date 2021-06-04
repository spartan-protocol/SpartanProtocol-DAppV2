/* eslint-disable no-unused-vars */
import React from 'react'
import { Row, Col, Card } from 'reactstrap'
import { usePool } from '../../../../store/pool/selector'
import { formatShortString } from '../../../../utils/web3'

const AssetSelect = (props) => {
  const pool = usePool()

  const pools = ['REMOVE_CURATED_POOL', 'ADD_CURATED_POOL']
  // const tokens = ['DELIST_BOND']
  const mode = pools.includes(props.selectedType) ? 'pool' : 'token'

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const setinputAddress = (addr) => {
    props.handleAddrChange(addr)
  }

  return (
    <>
      <Card className="py-2">
        {mode === 'token' ? (
          <>
            {pool.tokenDetails
              ?.filter((asset) => asset.balance > 0)
              .map((asset) => (
                <Row
                  key={`${asset.address}-asset`}
                  className="output-card px-3 py-2"
                  onClick={() => setinputAddress(asset.address)}
                  role="button"
                >
                  <Col xs="auto" className="">
                    <img
                      height="35px"
                      src={asset.symbolUrl}
                      alt={asset.name}
                      className=""
                    />
                  </Col>
                  <Col xs="auto" className="my-auto">
                    {asset.symbol}
                  </Col>
                  <Col className="my-auto text-right">
                    <div className="description">
                      {formatShortString(asset.address)}
                    </div>
                  </Col>
                </Row>
              ))}
          </>
        ) : (
          <>
            {pool.poolDetails
              ?.filter((asset) => asset.balance > 0)
              .map((asset) => (
                <Row
                  key={`${asset.address}-asset`}
                  className="output-card px-3 py-2"
                  onClick={() => setinputAddress(asset.address)}
                  role="button"
                >
                  <Col xs="auto" className="">
                    <img
                      height="35px"
                      src={getToken(asset.tokenAddress)?.symbolUrl}
                      alt={getToken(asset.tokenAddress)?.name}
                      className=""
                    />
                  </Col>
                  <Col xs="auto" className="my-auto">
                    {`${getToken(asset.tokenAddress)?.symbol}p`}
                  </Col>
                  <Col className="my-auto text-right">
                    <div className="description">
                      {formatShortString(asset.address)}
                    </div>
                  </Col>
                </Row>
              ))}
          </>
        )}
      </Card>
    </>
  )
}

export default AssetSelect
