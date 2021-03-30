import React from 'react'
// import { useDispatch } from 'react-redux'
import { Row, Button } from 'reactstrap'
import { getRouterContract } from '../../utils/web3Router'
// import { getPoolFactoryArray } from '../../store/poolFactory'
// import { getUtilsContract } from '../../utils/web3Utils'
// import { getPoolFactoryTokenArray } from '../../store/poolFactory'
// import { getPoolFactoryContract } from '../../utils/web3PoolFactory'
// import { getListedPools } from '../../store/utils/actions'
// import { getDaoTotalWeight } from '../../store/dao/actions'
// import { getAddresses } from '../../utils/web3'
// const addr = getAddresses()

const Dashboard = () => {
  // const dispatch = useDispatch()
  // // const hello = 'test'
  // const tokenArray = [
  //   '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
  //   '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  //   '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
  // ]

  const getPoolArray = async () => {
    const temp = await getRouterContract().callStatic.swap(
      '10000000000000000000',
      '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB',
      '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    )
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
