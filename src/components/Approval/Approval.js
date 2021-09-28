import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { Button, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool'
import {
  getAllowance1,
  getAllowance2,
  getApproval,
  useWeb3,
} from '../../store/web3'

import { BN } from '../../utils/bigNumber'
import { Icon } from '../Icons/icons'
import Notifications from '../Notifications/Notifications'

/**
 * An approval/allowance check + actioner
 * @param tokenAddress
 * @param symbol
 * @param walletAddress
 * @param contractAddress
 * @param txnAmount
 * @param assetNumber (1 or 2)
 */
const Approval = ({
  tokenAddress,
  symbol,
  walletAddress,
  contractAddress,
  txnAmount,
  assetNumber,
}) => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const wallet = useWeb3React()

  const [notify, setNotify] = useState(false)
  const [pending, setPending] = useState(false)

  const getAllowance = () => {
    if (tokenAddress && walletAddress && contractAddress) {
      if (assetNumber === '1') {
        dispatch(getAllowance1(tokenAddress, wallet, contractAddress))
      } else if (assetNumber === '2') {
        dispatch(getAllowance2(tokenAddress, wallet, contractAddress))
      }
    }
  }

  const handleApproval = async () => {
    setPending(true)
    setNotify(true)
    await dispatch(getApproval(tokenAddress, contractAddress, wallet))
    setNotify(false)
    setPending(false)
    getAllowance()
  }

  useEffect(() => {
    getAllowance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pool.poolDetails,
    tokenAddress,
    symbol,
    walletAddress,
    contractAddress,
    txnAmount,
    assetNumber,
  ])

  return (
    <>
      {BN(web3[`allowance${assetNumber}`]).isLessThan(txnAmount) && (
        <Col>
          <Notifications show={notify} txnType="approve" />
          <Button
            variant="info"
            onClick={async () => {
              handleApproval()
            }}
          >
            <Icon icon="lock" fill="white" size="20" className="me-1" />
            Approve {symbol}
            {pending && (
              <Icon icon="cycle" size="20" className="anim-spin ms-1" />
            )}
          </Button>
        </Col>
      )}
    </>
  )
}

export default Approval
