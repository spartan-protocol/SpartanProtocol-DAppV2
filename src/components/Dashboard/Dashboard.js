import React from 'react'
import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { getPoolFactoryPool } from '../../store/poolFactory'
// import { getListedPools } from '../../store/utils/actions'
// import { getDaoTotalWeight } from '../../store/dao/actions'
// import { getAddresses } from '../../utils/web3'
// const addr = getAddresses()

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button
          onClick={() =>
            dispatch(
              getPoolFactoryPool('0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867'),
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
