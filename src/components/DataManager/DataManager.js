import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  usePoolFactory,
  getPoolFactoryTokenArray,
  getPoolFactoryCuratedArray,
  getPoolFactoryDetailedArray,
  getPoolFactoryFinalArray,
} from '../../store/poolFactory'
import { getPoolFactoryFinalLpArray } from '../../store/poolFactory/actions'
// import { getSynthArray } from '../../store/synth/actions'
import { addNetworkMM, addNetworkBC, getSpartaPrice } from '../../store/web3'
// import { usePrevious } from '../../utils/helpers'
import { changeNetwork, getAddresses } from '../../utils/web3'

const DataManager = () => {
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const wallet = useWallet()
  const [prevNetwork, setPrevNetwork] = useState(
    JSON.parse(window.localStorage.getItem('network')),
  )
  // const prevNetwork = usePrevious(network)

  useEffect(() => {
    const checkNetwork = () => {
      if (prevNetwork.net === 'mainnet' || prevNetwork.net === 'testnet') {
        changeNetwork(prevNetwork.net)
        dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
      } else {
        changeNetwork('testnet') // CHANGE TO MAINNET AFTER DEPLOY
        dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
      }
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

  const [prevTokenArray, setPrevTokenArray] = useState(poolFactory.tokenArray)

  useEffect(() => {
    const checkArrays = () => {
      if (
        JSON.parse(window.localStorage.getItem('network')).net !==
        prevNetwork.net
      ) {
        setPrevNetwork(JSON.parse(window.localStorage.getItem('network')))
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        setPrevTokenArray(poolFactory.tokenArray)
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
        setPrevTokenArray(poolFactory.curatedPoolCount)
      }
    }
    checkArrays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

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
      if (finalArray !== prevFinalArray && finalArray?.length > 0) {
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
