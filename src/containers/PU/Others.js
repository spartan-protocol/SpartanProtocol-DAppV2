import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useDispatch } from 'react-redux'
import { appAsset, useApp } from '../../store/app'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { checkResolved } from '../../utils/helpers'
import { tempChains } from '../../utils/web3'
import { getPoolContract } from '../../utils/getContracts'
import AssetSelect from '../../components/AssetSelect'
import { getPool } from '../../utils/math/utils'

const Others = () => {
  const dispatch = useDispatch()

  const { addresses, asset1, chainId } = useApp()
  const pool = usePool()
  const web3 = useWeb3()

  const [poolVars, setPoolVars] = useState(false)
  const [poolObj, setPoolObj] = useState(false)

  useEffect(() => {
    if (pool.poolDetails) {
      let _asset1Addr = asset1.addr
      _asset1Addr = getPool(_asset1Addr, pool.poolDetails)?.curated
        ? _asset1Addr
        : addresses.bnb
      setPoolObj(getPool(_asset1Addr, pool.poolDetails))
      dispatch(appAsset('1', _asset1Addr, 'pool'))
    }
  }, [addresses.bnb, asset1.addr, dispatch, pool.poolDetails])

  // MOVE THIS TO REDUX & CLEAN UP DEPS
  useEffect(() => {
    let isCancelled = false
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
      if (!isCancelled) {
        setPoolVars(resolved)
      }
    }
    if (tempChains.includes(chainId) && pool.poolDetails && poolObj.address) {
      getPoolDetails()
    }
    return () => {
      isCancelled = true
    }
  }, [chainId, pool.poolDetails, poolObj.address, web3.rpcs])

  return (
    <>
      <Col>
        <Card>
          <Card.Header>Other Vars</Card.Header>
          <Card.Body>
            <div className="ms-1">
              <AssetSelect
                priority="1"
                filter={['pool']}
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
