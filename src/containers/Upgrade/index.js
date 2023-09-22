import React from 'react'
import Row from 'react-bootstrap/Row'
import Upgrade from './Upgrade'

const Overview = () => (
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   const getData = () => {
  //     dispatch(fallenSpartansCheck(wallet))
  //   }
  //   getData() // Run on load
  //   const interval = setInterval(() => {
  //     getData() // Run on interval
  //   }, 5000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [dispatch, wallet])

  <>
    <div className="content">
      <Row>
        <Upgrade />
      </Row>
    </div>
  </>
)

export default Overview
