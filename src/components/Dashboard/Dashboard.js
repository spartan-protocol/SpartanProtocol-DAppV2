import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
// import { getListedPools } from '../../store/utils/actions'
import { getDaoTotalWeight } from '../../store/dao/actions'
// import { getAddresses } from '../../utils/web3'

// const addr = getAddresses()

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button onClick={() => dispatch(getDaoTotalWeight())}>TEST</Button>
      </Row>
    </div>
  )
}

export default Dashboard
