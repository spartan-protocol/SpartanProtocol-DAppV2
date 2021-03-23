import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { routerSwapAssets } from '../../store/router/actions'
import { getAddresses, TEST_TOKEN } from '../../utils/web3'

const addr = getAddresses()

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button
          onClick={() =>
            dispatch(routerSwapAssets('10', addr.sparta, TEST_TOKEN, true))
          }
        >
          TEST
        </Button>
      </Row>
    </div>
  )
}

export default Dashboard
