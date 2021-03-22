import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { TEST_WALLET } from '../../utils/web3'

// reactstrap components
import { getBondClaimable } from '../../store/bond'

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button
          onClick={() =>
            dispatch(
              getBondClaimable(
                '0xd7EF54D4CF64662A9Fdae6bF6E690A686cE54414',
                TEST_WALLET,
                '0x0000000000000000000000000000000000000000',
              ),
            )
          }
        >
          TEST
        </Button>
      </Row>
    </div>
  )
}

export default Dashboard
