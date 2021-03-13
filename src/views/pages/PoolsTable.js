/* eslint-disable global-require */

import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {CardBody, CardHeader, Collapse} from 'reactstrap'

import Button from 'react-bootstrap/Button'


import bnb from '../../assets/icons/BNB.svg'
import coin_bnb from '../../assets/icons/coin_bnb.svg'
import coin_sparta from '../../assets/icons/coin_sparta.svg'
import bnb_sparta from '../../assets/icons/bnb_sparta.png'

const PoolsTable = () => {
  //   const [openedCollapseOne, setopenedCollapseOne] = React.useState(true)
  //   const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false)
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)
  return (
      <>
        <Card className="card-body">
          <Row xs="1" sm="2" md="4">
            <Col>Column</Col>
            <Col>Column</Col>
            <Col>Column</Col>
            <Col>Column</Col>
          </Row>
        </Card>





      </>
  )
}

export default PoolsTable;
