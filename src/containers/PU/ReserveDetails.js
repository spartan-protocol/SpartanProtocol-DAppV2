import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool'
import { getReservePOLDetails, useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import { BN, formatFromWei } from '../../utils/bigNumber'
import { getPool, getToken } from '../../utils/math/utils'
import { getNetwork, tempChains } from '../../utils/web3'

const ReserveDetails = () => {
  const pool = usePool()
  const dispatch = useDispatch()
  const reserve = useReserve()
  const sparta = useSparta()

  const [selection, setSelection] = useState('')

  useEffect(() => {
    if (tempChains.includes(getNetwork().chainId)) {
      dispatch(getReservePOLDetails())
    }
  }, [dispatch, pool.poolDetails])

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
