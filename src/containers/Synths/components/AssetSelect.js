import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { usePool } from '../../../store/pool'
import { useSynth } from '../../../store/synth'
import { formatShortString } from '../../../utils/web3'

const AssetSelect = (props) => {
  const pool = usePool()
  const synth = useSynth()

  const setinputAddress = (address) => {
    props.handleAddrChange(address)
  }

  const getArray = () =>
    pool.tokenDetails?.filter(
      (asset) =>
        pool.poolDetails.filter(
          (i) => i.curated && i.tokenAddress === asset.address,
        ).length > 0 &&
        synth.synthDetails.filter(
          (x) => x.tokenAddress === asset.address && !x.address,
        ).length > 0,
    )

  return (
    <>
      <Card className="py-2">
        {getArray().length > 0 ? (
          <>
            {getArray().map((asset) => (
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
                    className="rounded-circle"
                  />
                </Col>
                <Col xs="auto" className="my-auto">
                  {asset.symbol}s
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
            <Col>
              No valid assets, to create a new synth, you must first vote the
              asset into curated status via DAO proposals
            </Col>
          </Row>
        )}
      </Card>
    </>
  )
}

export default AssetSelect
