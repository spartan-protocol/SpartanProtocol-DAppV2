import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
import { Row, Col } from 'reactstrap'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { usePool } from '../../../store/pool'
// import { fallenSpartansCheck } from '../../../store/sparta/actions'
import Upgrade from './Upgrade'

const TokenSwap = () => {
  const pool = usePool()
  // const dispatch = useDispatch()

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    // UNCOMMENT BELOW ONCE FS CONTRACT IS DEPLOYED
    // dispatch(fallenSpartansCheck())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <h2 className="text-title-small my-3 mr-2">TokenSwap</h2>
          </Col>
        </Row>
        <Row className="row-480">
          {pool.poolDetails?.length > 0 && <Upgrade />}
          {pool.poolDetails?.length <= 0 && <HelmetLoading />}
        </Row>
      </div>
    </>
  )
}

export default TokenSwap
