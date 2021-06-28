import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect } from 'react'
import { Button, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import {
  getAllowance1,
  getAllowance2,
  getApproval,
  useWeb3,
} from '../../store/web3'

import { BN } from '../../utils/bigNumber'
import { Icon } from '../Icons/icons'

/**
 * An approval/allowance check + actioner
 * @param {address} tokenAddress
 * @param {address} symbol
 * @param {address} walletAddress
 * @param {address} contractAddress
 * @param {string} txnAmount
 * @param {string} assetNumber (1 or 2)
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
  const wallet = useWallet()

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
    await dispatch(getApproval(tokenAddress, contractAddress, wallet))
    getAllowance()
  }

  useEffect(() => {
    getAllowance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tokenAddress,
    symbol,
    walletAddress,
    contractAddress,
    txnAmount,
    assetNumber,
    web3.approval,
  ])

  return (
    <>
      {BN(web3[`allowance${assetNumber}`].toString()).comparedTo(txnAmount) ===
        -1 && (
        <Col>
          <Button
            variant="info"
            onClick={async () => {
              handleApproval()
            }}
          >
            <Icon icon="lock" fill="white" size="20" className="me-1" />
            Approve {symbol}
          </Button>
        </Col>
      )}
    </>
  )
}

export default Approval
