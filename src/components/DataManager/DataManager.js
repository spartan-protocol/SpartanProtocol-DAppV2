import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  usePoolFactory,
  getPoolFactoryTokenCount,
  getPoolFactoryTokenArray,
  // getPoolFactoryArray,
  getPoolFactoryCuratedCount,
  getPoolFactoryCuratedArray,
  getPoolFactoryDetailedArray,
  getPoolFactoryFinalArray,
} from '../../store/poolFactory'
import { getPoolFactoryFinalLpArray } from '../../store/poolFactory/actions'
import { addNetworkMM, addNetworkBC, getSpartaPrice } from '../../store/web3'
import { changeNetwork, getAddresses } from '../../utils/web3'

const DataManager = () => {
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const wallet = useWallet()

  useEffect(() => {
    const tempNetwork = JSON.parse(window.localStorage.getItem('network'))
    const checkNetwork = () => {
      if (tempNetwork.net === 'mainnet' || tempNetwork.net === 'testnet') {
        changeNetwork(tempNetwork.net)
        dispatch(addNetworkMM())
        dispatch(addNetworkBC())
      } else {
        changeNetwork('testnet')
        dispatch(addNetworkMM())
        dispatch(addNetworkBC())
      } // CHANGE TO MAINNET AFTER DEPLOY
    }

    checkNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getSpartaPrice())
    }, 7500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [prevTokenCount, setPrevTokenCount] = useState(poolFactory.tokenCount)
  const [prevCuratedCount, setPrevCuratedCount] = useState(
    poolFactory.curatedPoolCount,
  )

  useEffect(() => {
    const checkCounts = () => {
      dispatch(getPoolFactoryTokenCount())
      setPrevTokenCount(poolFactory.tokenCount)
      dispatch(getPoolFactoryCuratedCount())
      setPrevCuratedCount(poolFactory.curatedPoolCount)
    }

    checkCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

  const [prevTokenArray, setPrevTokenArray] = useState(poolFactory.tokenArray)

  useEffect(() => {
    const tokenCount = poolFactory.tokenCount.toString()
    const checkArrays = () => {
      if (tokenCount !== prevTokenCount && tokenCount > 0) {
        dispatch(getPoolFactoryTokenArray(tokenCount, addr.wbnb))
        setPrevTokenArray(poolFactory.tokenArray)
      }
      const curatedCount = poolFactory.curatedPoolCount.toString()
      if (curatedCount !== prevCuratedCount && curatedCount > 0) {
        dispatch(getPoolFactoryCuratedArray(curatedCount))
        setPrevTokenArray(poolFactory.curatedPoolCount)
      }
    }

    checkArrays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.tokenCount])

  const [prevDetailedArray, setPrevDetailedArray] = useState(
    poolFactory.detailedArray,
  )

  useEffect(() => {
    const { tokenArray } = poolFactory
    const checkDetailedArray = () => {
      if (tokenArray !== prevTokenArray && tokenArray.length > 0) {
        dispatch(getPoolFactoryDetailedArray(tokenArray, addr.sparta))
        setPrevDetailedArray(poolFactory.detailedArray)
      }
    }

    checkDetailedArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.tokenArray, window.sessionStorage.getItem('walletConnected')])

  const [prevFinalArray, setPrevFinalArray] = useState(poolFactory.finalArray)

  useEffect(() => {
    const { detailedArray } = poolFactory
    const checkFinalArray = () => {
      if (detailedArray !== prevDetailedArray && detailedArray.length > 0) {
        dispatch(
          getPoolFactoryFinalArray(detailedArray, poolFactory.curatedPoolArray),
        )
        setPrevFinalArray(poolFactory.finalArray)
      }
    }

    checkFinalArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.detailedArray])

  useEffect(() => {
    const { finalArray } = poolFactory
    const checkFinalArrayForLP = () => {
      if (
        wallet.account &&
        finalArray !== prevFinalArray &&
        finalArray?.length > 0
      ) {
        dispatch(getPoolFactoryFinalLpArray(finalArray, wallet.account))
        // setPrevFinalArray(poolFactory.finalArray)
      }
    }

    checkFinalArrayForLP()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.finalArray])

  return <></>
}

export default DataManager
