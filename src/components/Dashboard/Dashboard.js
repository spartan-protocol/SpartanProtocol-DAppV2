import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
// import { TEST_WALLET } from '../../utils/web3'

import { daoProposalNewParam } from '../../store/dao/actions'

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button onClick={() => dispatch(daoProposalNewParam('buy', 'BUY'))}>
          TEST
        </Button>
      </Row>
    </div>
  )
}

export default Dashboard
