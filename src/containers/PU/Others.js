import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useApp } from '../../store/app'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { checkResolved } from '../../utils/helpers'
import { tempChains } from '../../utils/web3'
import { getPoolContract } from '../../utils/getContracts'
import AssetSelect from '../../components/AssetSelect'
import { getPool } from '../../utils/math/utils'

const Others = () => {
  const app = useApp()
  const pool = usePool()
  const web3 = useWeb3()

  const [poolVars, setPoolVars] = useState(false)
  const [poolObj, setPoolObj] = useState(false)

  useEffect(() => {
    const tryParsePool = (data) => {
      try {
        return JSON.parse(data)
      } catch (e) {
        return pool.poolDetails[0]
      }
    }
    if (pool.poolDetails) {
      window.localStorage.setItem('assetType1', 'token')
      let asset1 = tryParsePool(window.localStorage.getItem('assetSelected1'))
      asset1 = getPool(asset1.tokenAddress, pool.poolDetails)
      setPoolObj(asset1)
      window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, window.localStorage.getItem('assetSelected1')])

  // MOVE THIS TO REDUX & CLEAN UP DEPS
  useEffect(() => {
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
    if (
      tempChains.includes(app.chainId) &&
      pool.poolDetails &&
      poolObj.address
    ) {
      getPoolDetails()
    }
  }, [app.chainId, pool.poolDetails, poolObj.address, web3.rpcs])

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
