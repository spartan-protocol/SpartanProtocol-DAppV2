import React from 'react'
import { useDispatch } from 'react-redux'

// reactstrap components
import { Row, Button } from 'reactstrap'
import { getBondListedCount } from '../../store/bond'

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="content">
      <Row>
        <Button onClick={() => dispatch(getBondListedCount())}>TEST</Button>
      </Row>
    </div>
  )
}

export default Dashboard
