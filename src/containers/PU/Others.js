import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { checkResolved } from '../../utils/helpers'
import { getNetwork, tempChains } from '../../utils/web3'
import { getPoolContract } from '../../utils/getContracts'
import AssetSelect from '../../components/AssetSelect'
import { getPool } from '../../utils/math/utils'

const Others = () => {
  const web3 = useWeb3()
  const pool = usePool()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const [poolVars, setPoolVars] = useState(false)
  const [poolObj, setPoolObj] = useState(false)

  const getNet = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getNet()
    }
    const timer = setTimeout(() => {
      getNet()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const tryParsePool = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  const isLoading = () => {
    if (!pool.tokenDetails || !pool.poolDetails || !pool.curatedPools) {
      return true
    }
    return false
  }

  useEffect(() => {
    const getAssetDetails = () => {
      if (!isLoading()) {
        window.localStorage.setItem('assetType1', 'token')
        let asset1 = tryParsePool(window.localStorage.getItem('assetSelected1'))
        asset1 = getPool(asset1.tokenAddress, pool.poolDetails)
        setPoolObj(asset1)
        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
      }
    }
    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, window.localStorage.getItem('assetSelected1')])

  const getPoolDetails = async () => {
    const contract = getPoolContract(poolObj.address, null, web3.rpcs)
    let awaitArray = [
      contract.callStatic.stirStamp(),
      contract.callStatic.synthCap(),
    ]
    awaitArray = await Promise.allSettled(awaitArray)
    const resolved = {
      stirStamp: checkResolved(awaitArray[0], 'Error').toString(),
      synthCap: checkResolved(awaitArray[1], 'Error').toString(),
    }
    setPoolVars(resolved)
  }

  useEffect(() => {
    if (tempChains.includes(network.chainId) && pool.poolDetails && poolObj) {
      getPoolDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, poolObj])

  // const isLoading = () => {
  //   if (!poolVars) {
  //     return true
  //   }
  //   return false
  // }

  return (
    <>
      <Col>
        <Card>
          <Card.Header>Other Vars</Card.Header>
          <Card.Body>
            <div className="ms-1">
              <AssetSelect
                priority="1"
                filter={['token']}
                whiteList={pool.curatedPools}
                onClick={() => setPoolVars(false)}
              />
            </div>
            <table className="w-100">
              <thead>
                <tr>
                  <th>Var</th>
                  <th>Val</th>
                  <th>Set</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pool.stirStamp()</td>
                  <td>{poolVars?.stirStamp}</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Pool.synthCap()</td>
                  <td>{poolVars?.synthCap}</td>
                  <td>Router.changeSynthCap(basisPoints, {poolObj.address})</td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default Others
