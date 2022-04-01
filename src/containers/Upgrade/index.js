import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import { useWeb3React } from '@web3-react/core'
import { fallenSpartansCheck } from '../../store/sparta'
import Upgrade from './Upgrade'
import { useWeb3 } from '../../store/web3'

const Overview = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const wallet = useWeb3React()

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(fallenSpartansCheck(wallet, web3.rpcs))
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    settrigger0(0)
  }, [wallet.account])

  return (
    <>
      <div className="content">
        <Row>
          <Upgrade />
        </Row>
      </div>
    </>
  )
}

export default Overview
