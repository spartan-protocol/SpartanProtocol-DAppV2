import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useBond } from '../../../../store/bond'
import { usePool } from '../../../../store/pool/selector'
import { formatShortString, getAddresses } from '../../../../utils/web3'

const AssetSelect = (props) => {
  const pool = usePool()
  const bond = useBond()
  const addr = getAddresses()
  let poolMode = false
  const filter = [addr.spartav1, addr.spartav2]

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const setinputAddress = (address) => {
    props.handleAddrChange(address)
  }

  const getArray = () => {
    if (props.selectedType === 'REMOVE_CURATED_POOL') {
      poolMode = true
      return pool.poolDetails?.filter(
        (asset) =>
          asset.curated === true && !filter.includes(asset.tokenAddress),
      )
    }
    if (props.selectedType === 'ADD_CURATED_POOL') {
      poolMode = true
      return pool.poolDetails?.filter(
        (asset) =>
          asset.curated === false && !filter.includes(asset.tokenAddress),
      )
    }
    if (props.selectedType === 'LIST_BOND') {
      poolMode = false
      return pool.tokenDetails?.filter(
        (asset) =>
          !filter.includes(asset.address) &&
          !bond.listedAssets.includes(asset.address),
      )
    }
    // ELSE: DELIST_BOND
    poolMode = false
    return pool.tokenDetails?.filter(
      (asset) =>
        !filter.includes(asset.address) &&
        bond.listedAssets.includes(asset.address),
    )
  }

  return (
    <>
      <Card className="py-2">
        {getArray().length > 0 ? (
          <>
            {getArray().map((asset) => (
              <Row
                key={`${asset.address}-asset`}
                className="output-card px-3 py-2"
                onClick={() =>
                  setinputAddress(poolMode ? asset.tokenAddress : asset.address)
                }
                role="button"
              >
                <Col xs="auto" className="">
                  <img
                    height="35px"
                    src={
                      poolMode
                        ? getToken(asset.tokenAddress).symbolUrl
                        : asset.symbolUrl
                    }
                    alt={asset.name}
                    className=""
                  />
                </Col>
                <Col xs="auto" className="my-auto">
                  {poolMode
                    ? `${getToken(asset.tokenAddress).symbol}p`
                    : asset.symbol}
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
          <Row className="output-card px-3 py-2">
            <Col>No valid assets</Col>
          </Row>
        )}
      </Card>
    </>
  )
}

export default AssetSelect
