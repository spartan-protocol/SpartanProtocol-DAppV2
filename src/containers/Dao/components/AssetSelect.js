import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useApp } from '../../../store/app'
import { usePool } from '../../../store/pool'
import { useSynth } from '../../../store/synth'
import { BN, convertToWei } from '../../../utils/bigNumber'
import { formatShortString } from '../../../utils/web3'

const AssetSelect = (props) => {
  const { addresses } = useApp()
  const pool = usePool()
  const synth = useSynth()

  const filter = [addresses.spartav1, addresses.spartav2]
  const genericMsg = 'No valid assets'
  const maxCurateMsg =
    'The protocol is currently at its max amount of Curated pools. If you would like to propse a new Curated pool, there must first be a proposal to remove one. This max-Curated limit could however be increased in the future.'

  const [message, setMessage] = useState(genericMsg)

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const setinputAddress = (address) => {
    props.handleAddrChange(address)
  }

  const getDetails = () => {
    const finArray = []
    if (props.selectedType === 'REMOVE_CURATED_POOL') {
      if (message !== genericMsg) {
        setMessage(genericMsg)
      }
      const assets = pool.poolDetails?.filter(
        (asset) => asset.curated && !filter.includes(asset.tokenAddress),
      )
      for (let i = 0; i < assets.length; i++) {
        finArray.push({
          symbolUrl: getToken(assets[i].tokenAddress).symbolUrl,
          symbol: `${getToken(assets[i].tokenAddress).symbol}p`,
          addr: assets[i].tokenAddress,
        })
      }
      return finArray
    }
    if (props.selectedType === 'ADD_CURATED_POOL') {
      const curatedCount = pool.curatedPools?.length
      let assets = []
      if (curatedCount < 5) {
        assets = pool.poolDetails?.filter(
          (asset) =>
            !asset.curated &&
            !filter.includes(asset.tokenAddress) &&
            BN(asset.baseAmount).isGreaterThan(convertToWei(250000)),
        )
      } else if (message !== maxCurateMsg) {
        setMessage(maxCurateMsg)
      }
      for (let i = 0; i < assets.length; i++) {
        finArray.push({
          symbolUrl: getToken(assets[i].tokenAddress).symbolUrl,
          symbol: `${getToken(assets[i].tokenAddress).symbol}p`,
          addr: assets[i].tokenAddress,
        })
      }
      return finArray
    }
    if (props.selectedType === 'REALISE') {
      if (message !== genericMsg) {
        setMessage(genericMsg)
      }
      const assets = synth.synthDetails?.filter((asset) => asset.address)
      for (let i = 0; i < assets.length; i++) {
        finArray.push({
          symbolUrl: getToken(assets[i].tokenAddress).symbolUrl,
          symbol: `${getToken(assets[i].tokenAddress).symbol}p`,
          addr: assets[i].address,
        })
      }
      return finArray
    }
    return []
  }

  return (
    <>
      <Card className="py-2">
        {getDetails().length > 0 ? (
          <>
            {getDetails().map((asset) => (
              <Row
                key={`${asset.addr}-asset`}
                className="output-card px-3 py-2"
                onClick={() => setinputAddress(asset.addr)}
                role="button"
              >
                <Col xs="auto">
                  <img
                    height="35px"
                    className="rounded-circle"
                    src={asset.symbolUrl}
                    alt={asset.name}
                  />
                </Col>
                <Col xs="auto" className="my-auto">
                  {asset.symbol}
                </Col>
                <Col className="my-auto text-right">
                  <div className="description">
                    {formatShortString(asset.addr)}
                  </div>
                </Col>
              </Row>
            ))}
          </>
        ) : (
          <Row className="output-card px-3 py-2">
            <Col>{message}</Col>
          </Row>
        )}
      </Card>
    </>
  )
}

export default AssetSelect
