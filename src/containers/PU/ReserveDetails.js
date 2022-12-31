import React, { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { usePool } from '../../store/pool'
import { useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import { BN, formatFromWei } from '../../utils/bigNumber'
import { getPool, getToken } from '../../utils/math/utils'

const ReserveDetails = () => {
  const pool = usePool()
  const reserve = useReserve()
  const sparta = useSparta()

  const [selection, setSelection] = useState('')

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
                      <tr key={pol.address}>
                        <td>
                          <Form.Check
                            label={
                              getToken(
                                getPool(pol.address, pool.poolDetails)
                                  .tokenAddress,
                                pool.tokenDetails,
                              ).symbol
                            }
                            type="radio"
                            name="group1"
                            id={
                              (getPool(pol.address, pool.poolDetails)
                                .tokenAddress,
                              pool.tokenDetails)
                            }
                            onClick={() =>
                              setSelection(
                                getPool(pol.address, pool.poolDetails)
                                  .tokenAddress,
                                pool.tokenDetails,
                              )
                            }
                          />
                        </td>
                        <td>
                          {formatFromWei(
                            getPool(pol.address, pool.poolDetails).baseAmount,
                            0,
                          )}
                        </td>
                        <td>{formatFromWei(pol.spartaLocked, 0)}</td>
                        <td>
                          {BN(pol.spartaLocked)
                            .div(
                              getPool(pol.address, pool.poolDetails).baseAmount,
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
                      {formatFromWei(sparta.globalDetails.spartaBalance, 0)}
                    </td>
                    <td>
                      {BN(sparta.globalDetails.spartaBalance)
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
              <li>Reserve.setParams({selection})</li>
              <hr />
              Realise {getToken(selection, pool.tokenDetails).symbol}-SPP:
              <li>Reserve.realisePOL({selection})</li>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default ReserveDetails
