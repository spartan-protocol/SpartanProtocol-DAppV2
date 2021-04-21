import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import {
  getAllowance1,
  getAllowance2,
  getApproval,
  useWeb3,
} from '../../store/web3'
import { BN } from '../../utils/bigNumber'

// import { usePoolFactory } from '../../store/poolFactory'

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

  const getAllowance = () => {
    if (tokenAddress && walletAddress && contractAddress) {
      if (assetNumber === '1') {
        dispatch(getAllowance1(tokenAddress, walletAddress, contractAddress))
      } else if (assetNumber === '2') {
        dispatch(getAllowance2(tokenAddress, walletAddress, contractAddress))
      }
    }
  }

  const handleApproval = async () => {
    await dispatch(getApproval(tokenAddress, contractAddress))
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
      {assetNumber === '1' && (
        <>
          {BN(web3.allowance1.toString()).comparedTo(txnAmount) === -1 && (
            <>
              <Button
                className="btn-fill w-100 h-100"
                color="neutral"
                onClick={() => {
                  handleApproval()
                }}
              >
                <i className="icon-extra-small icon-lock icon-light align-middle" />
                <br />
                Approve {symbol}
              </Button>
            </>
          )}
          {BN(web3.allowance1.toString()).comparedTo(txnAmount) === 1 && (
            <>
              <Button className="btn-fill w-100 h-100" color="success">
                <i className="icon-extra-small icon-lock icon-dark align-middle" />
                <i className="icon-extra-small icon-check icon-light align-middle" />
                <br />
                {symbol} Ready
              </Button>
            </>
          )}
        </>
      )}
      {assetNumber === '2' && (
        <>
          {BN(web3.allowance2.toString()).comparedTo(txnAmount) === -1 && (
            <>
              <Button
                className="btn-fill w-100 h-100"
                color="neutral"
                onClick={async () => {
                  handleApproval()
                }}
              >
                <i className="icon-extra-small icon-lock icon-light align-middle" />
                <br />
                Approve {symbol}
              </Button>
            </>
          )}
          {BN(web3.allowance2.toString()).comparedTo(txnAmount) === 1 && (
            <>
              <Button className="btn-fill w-100 h-100" color="success">
                <i className="icon-extra-small icon-lock icon-dark align-middle" />
                <i className="icon-extra-small icon-check icon-light align-middle" />
                <br />
                {symbol} Ready
              </Button>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Approval
