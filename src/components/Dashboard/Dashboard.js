import React from 'react'
import { Row, Button } from 'reactstrap'
import { getWbnbContract } from '../../utils/web3'

// const addr = getAddresses()

const Dashboard = () => {
  // const wallet = useWallet()
  // const dispatch = useDispatch()
  // // const hello = 'test'
  // const tokenArray = [
  //   '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
  //   '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  //   '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
  // ]

  const getPoolArray = async () => {
    const temp = await getWbnbContract()
    // .deposit(
    //   wallet.account,
    //   '10000000000000000000',
    // )
    console.log(temp)
  }

  return (
    <div className="content">
      <Row>
        <Button onClick={() => getPoolArray()}>TEST</Button>
      </Row>
    </div>
  )
}

export default Dashboard
