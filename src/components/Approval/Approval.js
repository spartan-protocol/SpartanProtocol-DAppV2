import React, { useEffect } from 'react'
import ReactBSAlert from 'react-bootstrap-sweetalert'
import { useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { getAllowance, getApproval, useWeb3 } from '../../store/web3'
import { BN } from '../../utils/bigNumber'
// import { usePoolFactory } from '../../store/poolFactory'

/**
 * An approval/allowance check + actioner
 * @param {address} tokenAddress
 * @param {address} symbol
 * @param {address} walletAddress
 * @param {address} contractAddress
 * @param {string} txnAmount
 */
const Approval = ({
  tokenAddress,
  symbol,
  walletAddress,
  contractAddress,
  txnAmount,
}) => {
  const dispatch = useDispatch()
  const [alert, setAlert] = React.useState(null)
  const web3 = useWeb3()

  useEffect(() => {
    const checkAllowance = () => {
      if (tokenAddress && walletAddress && contractAddress) {
        dispatch(getAllowance(tokenAddress, walletAddress, contractAddress))
      }
    }
    checkAllowance()
  }, [contractAddress, tokenAddress, walletAddress, dispatch, web3.approval])

  const hideAlert = () => {
    setAlert(null)
  }

  const successDelete = () => {
    dispatch(getApproval(tokenAddress, contractAddress))
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title="Transaction successfully!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        0xce2fd7544e0b2cc94692d4a704debef7bcb61328 <br />
        <br />
        Copy
        <span data-notify="icon" className="bd-icons icon-single-copy-04" />
      </ReactBSAlert>,
    )
  }

  const warningWithConfirmMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="danger"
        confirmBtnText="Approve"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Proceed to approve {symbol}
      </ReactBSAlert>,
    )
  }

  return (
    <>
      {BN(web3.allowance._hex).comparedTo(txnAmount) === -1 && (
        <>
          {alert}
          <Button
            className="btn-fill w-100 h-100"
            color="default"
            onClick={warningWithConfirmMessage}
          >
            <i className="icon-extra-small icon-world icon-dark align-middle" />
            <i className="icon-extra-small icon-close icon-light align-middle" />
            <br />
            {symbol} Approve transaction
          </Button>
        </>
      )}
      {BN(web3.allowance._hex).comparedTo(txnAmount) === 1 && (
        <>
          <Button className="btn-fill w-100 h-100" color="secondary">
            <i className="icon-extra-small icon-lock icon-dark align-middle" />
            <i className="icon-extra-small icon-check icon-light align-middle" />
            <br />
            {symbol} Ready
          </Button>
        </>
      )}
    </>
  )
}

export default Approval
