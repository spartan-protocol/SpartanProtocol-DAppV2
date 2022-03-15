import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { checkResolved } from '../../utils/helpers'
import { getNetwork, tempChains } from '../../utils/web3'
import { getPoolContract } from '../../utils/getContracts'

const Others = () => {
  const web3 = useWeb3()
  const pool = usePool()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const [poolVars, setPoolVars] = useState(false)

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

  const getPoolDetails = async () => {
    const contract = getPoolContract(
      pool.poolDetails[0].address, // 0, 2, 3 = Curated IDs
      null,
      web3.rpcs,
    )
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
    if (tempChains.includes(network.chainId) && pool.poolDetails) {
      getPoolDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

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
                  <td>{poolVars?.stirStamp} (BNBp)</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Pool.synthCap()</td>
                  <td>{poolVars?.synthCap} (BNBp)</td>
                  <td>Router.changeSynthCap(basisPoints, poolAddr)</td>
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
