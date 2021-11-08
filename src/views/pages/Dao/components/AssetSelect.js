import React, { useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { allListedAssets, useBond } from '../../../../store/bond'
import { usePool } from '../../../../store/pool/selector'
import { useSynth } from '../../../../store/synth/selector'
import { BN, convertToWei } from '../../../../utils/bigNumber'
import { getPool } from '../../../../utils/math/utils'
import { formatShortString, getAddresses } from '../../../../utils/web3'

const AssetSelect = (props) => {
  const pool = usePool()
  const bond = useBond()
  const synth = useSynth()
  const addr = getAddresses()
  const dispatch = useDispatch()
  const filter = [addr.spartav1, addr.spartav2]

  useEffect(() => {
    dispatch(allListedAssets())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const setinputAddress = (address) => {
    props.handleAddrChange(address)
  }

  const getDetails = () => {
    const finArray = []
    if (props.selectedType === 'REMOVE_CURATED_POOL') {
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
      const assets = pool.poolDetails?.filter(
        (asset) =>
          !asset.curated &&
          !filter.includes(asset.tokenAddress) &&
          BN(asset.baseAmount).isGreaterThan(convertToWei(250000)),
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
    if (props.selectedType === 'REALISE') {
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
    if (props.selectedType === 'LIST_BOND') {
      const assets = pool.tokenDetails?.filter(
        (asset) =>
          !filter.includes(asset.address) &&
          getPool(asset.address, pool.poolDetails).curated &&
          !bond.listedAssets.includes(
            getPool(asset.address, pool.poolDetails).address,
          ),
      )
      for (let i = 0; i < assets.length; i++) {
        finArray.push({
          symbolUrl: assets[i].symbolUrl,
          symbol: assets[i].symbol,
          addr: assets[i].address,
        })
      }
      return finArray
    }
    if (props.selectedType === 'DELIST_BOND') {
      const assets = pool.tokenDetails?.filter(
        (asset) =>
          !filter.includes(asset.address) &&
          bond.listedAssets.includes(
            getPool(asset.address, pool.poolDetails).address,
          ),
      )
      for (let i = 0; i < assets.length; i++) {
        finArray.push({
          symbolUrl: assets[i].symbolUrl,
          symbol: assets[i].symbol,
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
                <Col xs="auto" className="">
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
            <Col>No valid assets</Col>
          </Row>
        )}
      </Card>
    </>
  )
}

export default AssetSelect
