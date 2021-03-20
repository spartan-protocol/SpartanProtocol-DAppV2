import React from 'react'

// reactstrap components
import { Row, Button } from 'reactstrap'
import { calcLiquidityHoldings } from '../../utils/web3Utils'

const Dashboard = () => (
  <div className="content">
    <Row>
      <Button onClick={() => calcLiquidityHoldings('123', '122', '122')}>
        TEST
      </Button>
    </Row>
  </div>
)

export default Dashboard
