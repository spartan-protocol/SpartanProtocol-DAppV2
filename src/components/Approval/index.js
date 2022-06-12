import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool'
import {
  getAllowance1,
  getAllowance2,
  getApproval,
  updateAllowance1,
  updateAllowance2,
  useWeb3,
} from '../../store/web3'

import { BN } from '../../utils/bigNumber'
import { getToken } from '../../utils/math/utils'
import { getAddresses } from '../../utils/web3'
import { Icon } from '../Icons/index'
import Notifications from '../Notifications/index'

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
  const { t } = useTranslation()
  const addr = getAddresses()

  const [notify, setNotify] = useState(false)
  const [pending, setPending] = useState(false)
  const [valid, setValid] = useState(false)

  const handleApproval = async () => {
    setPending(true)
    setNotify(true)
    await dispatch(getApproval(tokenAddress, contractAddress, wallet))
    setNotify(false)
    if (tokenAddress && walletAddress && contractAddress) {
      if (assetNumber === '1') {
        dispatch(getAllowance1(tokenAddress, wallet, contractAddress))
      } else if (assetNumber === '2') {
        dispatch(getAllowance2(tokenAddress, wallet, contractAddress))
      }
    }
  }

  useEffect(() => {
    if (tokenAddress && walletAddress && contractAddress) {
      if (assetNumber === '1') {
        dispatch(getAllowance1(tokenAddress, wallet, contractAddress))
      } else if (assetNumber === '2') {
        dispatch(getAllowance2(tokenAddress, wallet, contractAddress))
      }
    }
  }, [
    pool.poolDetails,
    tokenAddress,
    symbol,
    walletAddress,
    contractAddress,
    txnAmount,
    assetNumber,
    dispatch,
    wallet,
  ])

  useEffect(() => {
    let allowanceObj = 0
    if (assetNumber === '1') {
      allowanceObj = web3.allowance1
    } else if (assetNumber === '2') {
      allowanceObj = web3.allowance2
    }
    if (BN(allowanceObj).isGreaterThanOrEqualTo(txnAmount)) {
      setValid(true)
      setPending(false)
    } else {
      setValid(false)
    }
  }, [
    web3.allowance1,
    web3.allowance2,
    txnAmount,
    pool.poolDetails,
    assetNumber,
  ])

  useEffect(() => {
    dispatch(updateAllowance1('0'))
    dispatch(updateAllowance2('0'))
  }, [dispatch])

  // ~0.00047 BNB gas (approval) on TN || ~0.00025 BNB on MN
  const estMaxGas = '250000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  return (
    <>
      {!valid && (
        <Col>
          <Notifications show={notify} txnType="approve" />
          <Button
            disabled={!enoughGas()}
            onClick={async () => {
              handleApproval()
            }}
          >
            <Icon fill="white" icon="lock" size="20" className="me-1" />
            {enoughGas() ? <>Approve {symbol}</> : t('checkBnbGas')}
            {pending && (
              <Icon
                fill="white"
                icon="cycle"
                size="20"
                className="anim-spin ms-1"
              />
            )}
          </Button>
        </Col>
      )}
    </>
  )
}

export default Approval
