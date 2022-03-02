import React, { useEffect, useState } from 'react'
import { Card, Col, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool/selector'
import { getReservePOLDetails, useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import { useWeb3 } from '../../store/web3'
import { BN, formatFromWei } from '../../utils/bigNumber'
import { getPool, getToken } from '../../utils/math/utils'
import { getNetwork, tempChains } from '../../utils/web3'

const ReserveDetails = () => {
  const pool = usePool()
  const dispatch = useDispatch()
  const reserve = useReserve()
  const web3 = useWeb3()
  const sparta = useSparta()

  const [selection, setSelection] = useState('')
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)

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

  useEffect(() => {
    if (
      tempChains.includes(network.chainId) &&
      pool.curatedPools &&
      pool.poolDetails
    ) {
      dispatch(
        getReservePOLDetails(pool.curatedPools, pool.poolDetails, web3.rpcs),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.curatedPools, pool.poolDetails])

  const isLoading = () => {
    if (!pool.curatedPools || !reserve.polDetails || !pool.poolDetails) {
      return true
    }
    return false
  }

  return (
    <>
      <Col>
        <Card className="card-480">
          <Card.Header>Reserve Details</Card.Header>
          <Card.Body>
            <Form>
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Depth</th>
                    <th>Reserve</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading() &&
                    reserve.polDetails.map((pol) => (
                      <tr key={pol.tokenAddress}>
                        <td>
                          <Form.Check
                            label={
                              getToken(pol.tokenAddress, pool.tokenDetails)
                                .symbol
                            }
                            type="radio"
                            name="group1"
                            id={pol.tokenAddress}
                            onClick={() => setSelection(pol.tokenAddress)}
                          />
                        </td>
                        <td>
                          {formatFromWei(
                            getPool(pol.tokenAddress, pool.poolDetails)
                              .baseAmount,
                            0,
                          )}
                        </td>
                        <td>{formatFromWei(pol.spartaLocked, 0)}</td>
                        <td>
                          {BN(pol.spartaLocked)
                            .div(
                              getPool(pol.tokenAddress, pool.poolDetails)
                                .baseAmount,
                            )
                            .times(100)
                            .toFixed(1)}
                        </td>
                      </tr>
                    ))}

                  <tr>
                    <td colSpan="4">
                      <hr />
                    </td>
                  </tr>
                  <tr>
                    <td>SPARTA</td>
                    <td>
                      {formatFromWei(sparta.globalDetails.totalSupply, 0)}
                    </td>
                    <td>
                      {formatFromWei(reserve.globalDetails.spartaBalance, 0)}
                    </td>
                    <td>
                      {BN(reserve.globalDetails.spartaBalance)
                        .div(sparta.globalDetails.totalSupply)
                        .times(100)
                        .toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
              Change Reserve Asset to{' '}
              {getToken(selection, pool.tokenDetails).symbol}
              -SPP:
              <li>Reserve.setParams( {selection} )</li>
              <hr />
              Realise {getToken(selection, pool.tokenDetails).symbol}-SPP:
              <li>Reserve.realisePOL( {selection} )</li>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default ReserveDetails
