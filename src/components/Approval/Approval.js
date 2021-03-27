import React, { useEffect } from 'react'
import ReactBSAlert from 'react-bootstrap-sweetalert'
import { useDispatch } from 'react-redux'
import { Button, Card, CardText, CardBody } from 'reactstrap'
import { getAllowance } from '../../store/web3'
// import { usePoolFactory } from '../../store/poolFactory'

/**
 * An approval/allowance check + actioner
 * @param {address} tokenAddress
 * @param {address} walletAddress
 * @param {address} contractAddress
 * @param {string} txnAmount
 */
const Approval = (tokenAddress, walletAddress, contractAddress, txnAmount) => {
  const dispatch = useDispatch()
  const [alert, setAlert] = React.useState(null)
  const [allowance, setAllowance] = React.useState('0')

  useEffect(() => {
    const checkAllowance = () => {
      if (tokenAddress && walletAddress && contractAddress) {
        console.log('getting allowance')
        setAllowance(
          dispatch(getAllowance(tokenAddress, walletAddress, contractAddress)),
        )
      }
    }
    checkAllowance()
  }, [contractAddress, tokenAddress, walletAddress])

  const hideAlert = () => {
    setAlert(null)
  }

  const successDelete = () => {
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
        Proceed to approve *TOKEN1*
      </ReactBSAlert>,
    )
  }

  return (
    <>
      {allowance < txnAmount && (
        <Card>
          {alert}
          <Card>
            <CardBody className="text-center">
              <CardText>You need to approve *TOKEN1* first!</CardText>
              <Button
                className="btn-fill"
                color="primary"
                onClick={warningWithConfirmMessage}
              >
                Approve *TOKEN1*
              </Button>
            </CardBody>
          </Card>
        </Card>
      )}
    </>
  )
}

export default Approval
