import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { getTokenDetails } from '../../store/utils/actions'
// import { TEST_TOKEN } from '../../utils/web3'
import { getAddresses } from '../../utils/web3'

const addr = getAddresses()

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button onClick={() => dispatch(getTokenDetails(addr.wbnb))}>
          TEST
        </Button>
      </Row>
    </div>
  )
}

export default Dashboard
