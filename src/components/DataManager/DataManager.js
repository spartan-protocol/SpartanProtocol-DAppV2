import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getDaoHarvestAmount } from '../../store/dao/actions'
import {
  getDaoVaultMemberWeight,
  getDaoVaultTotalWeight,
} from '../../store/daoVault/actions'
import {
  usePoolFactory,
  getPoolFactoryTokenArray,
  getPoolFactoryCuratedArray,
  getPoolFactoryDetailedArray,
  getPoolFactoryFinalArray,
} from '../../store/poolFactory'
import { getPoolFactoryFinalLpArray } from '../../store/poolFactory/actions'
import { getSynthArray } from '../../store/synth/actions'
import { useSynth } from '../../store/synth/selector'
import {
  addNetworkMM,
  addNetworkBC,
  getSpartaPrice,
  getEventArray,
} from '../../store/web3'
// import { usePrevious } from '../../utils/helpers'
import { changeNetwork, getAddresses } from '../../utils/web3'
import { getBondContract } from '../../utils/web3Bond'
import { getDaoContract } from '../../utils/web3Dao'
import { getPoolContract } from '../../utils/web3Pool'
import { getRouterContract } from '../../utils/web3Router'
import { getSynthContract } from '../../utils/web3Synth'

const DataManager = () => {
  const synth = useSynth()
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const wallet = useWallet()
  const [prevNetwork, setPrevNetwork] = useState(
    JSON.parse(window.localStorage.getItem('network')),
  )
  // const prevNetwork = usePrevious(network)

  useEffect(() => {
    const checkNetwork = async () => {
      if (prevNetwork.net === 'mainnet' || prevNetwork.net === 'testnet') {
        changeNetwork(prevNetwork.net)
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
        // dispatch(getSynthArray()) // SYNTH ARRAY
      } else {
        changeNetwork('testnet') // CHANGE TO MAINNET AFTER DEPLOY
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
        // dispatch(getSynthArray()) // SYNTH ARRAY
      }
    }
    checkNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getSpartaPrice())
      dispatch(getDaoVaultTotalWeight())
    }, 7500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (wallet.account) {
        dispatch(getDaoVaultMemberWeight(wallet.account))
        dispatch(getDaoHarvestAmount(wallet.account))
      }
    }, 7500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account])

  useEffect(() => {
    const checkArrays = () => {
      if (
        JSON.parse(window.localStorage.getItem('network')).net !==
        prevNetwork.net
      ) {
        setPrevNetwork(JSON.parse(window.localStorage.getItem('network')))
        dispatch(getPoolFactoryTokenArray(addr.wbnb)) // TOKEN ARRAY
        dispatch(getPoolFactoryCuratedArray()) // CURATED ARRAY
        // dispatch(getSynthArray()) // SYNTH ARRAY
      }
    }
    checkArrays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

  const [prevDetailedArray, setPrevDetailedArray] = useState(
    poolFactory.detailedArray,
  )

  const [arrayTrigger, setArrayTrigger] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setArrayTrigger(arrayTrigger + 1)
    }, 10000)
    return () => clearInterval(interval)
  }, [arrayTrigger])

  useEffect(() => {
    const { tokenArray } = poolFactory
    if (tokenArray.length > 0) {
      dispatch(getSynthArray(tokenArray)) // SYNTH ARRAY
      dispatch(
        getPoolFactoryDetailedArray(tokenArray, addr.sparta, wallet.account),
      )
      setPrevDetailedArray(poolFactory.detailedArray)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.tokenArray, wallet.account, arrayTrigger])

  const [prevFinalArray, setPrevFinalArray] = useState(poolFactory.finalArray)

  useEffect(() => {
    const { detailedArray } = poolFactory
    const { curatedPoolArray } = poolFactory
    const { synthArray } = synth
    const checkFinalArray = () => {
      if (detailedArray !== prevDetailedArray && detailedArray.length > 0) {
        dispatch(
          getPoolFactoryFinalArray(detailedArray, curatedPoolArray, synthArray),
        )
        setPrevFinalArray(poolFactory.finalArray)
      }
    }
    checkFinalArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.detailedArray])

  const [prevFinalLpArray, setPrevFinalLpArray] = useState(
    poolFactory.finalLpArray,
  )

  useEffect(() => {
    const { finalArray } = poolFactory
    const checkFinalArrayForLP = () => {
      if (finalArray !== prevFinalArray && finalArray?.length > 0) {
        dispatch(getPoolFactoryFinalLpArray(finalArray, wallet.account))
        setPrevFinalLpArray(poolFactory.finalLpArray)
      }
    }
    checkFinalArrayForLP()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.finalArray])

  const [eventArray, setEventArray] = useState([])

  useEffect(() => {
    const { finalLpArray } = poolFactory
    const contracts = [getRouterContract(), getDaoContract(), getBondContract()]

    const listen = async (contract) => {
      await contract.on('*', (eventObject) => {
        setEventArray((oldArray) => [...oldArray, eventObject])
        console.log(eventObject)
      })
    }

    const mapOut = () => {
      if (
        finalLpArray?.length !== prevFinalLpArray?.length &&
        finalLpArray?.length > 0
      ) {
        for (let i = 0; i < contracts.length; i++) {
          contracts[i]?.removeAllListeners()
        }
        for (let i = 0; i < finalLpArray.length; i++) {
          if (finalLpArray[i]?.poolAddress) {
            contracts.push(getPoolContract(finalLpArray[i].poolAddress))
          }
          if (finalLpArray[i]?.synthAddress) {
            contracts.push(getSynthContract(finalLpArray[i].synthAddress))
          }
        }

        for (let i = 0; i < contracts.length; i++) {
          listen(contracts[i])
        }
      }
    }
    mapOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.finalLpArray])

  useEffect(() => {
    dispatch(getEventArray(eventArray))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventArray])

  return <></>
}

export default DataManager
