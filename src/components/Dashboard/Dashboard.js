import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { getAdjustedClaimRate } from '../../store/sparta/actions'
import { getAddresses } from '../../utils/web3'

const addr = getAddresses()

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button onClick={() => dispatch(getAdjustedClaimRate(addr.bond))}>
          TEST
        </Button>
      </Row>
    </div>
  )
}

export default Dashboard
