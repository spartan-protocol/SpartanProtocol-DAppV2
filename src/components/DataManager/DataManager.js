import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getBondVaultMemberDetails } from '../../store/bondVault/actions'
import {
  getCuratedPools,
  getListedPools,
  getListedTokens,
  getPoolDetails,
  getTokenDetails,
  usePoolFactory,
} from '../../store/poolFactory'
import { getSynthArray, getSynthDetails } from '../../store/synth/actions'
import { useSynth } from '../../store/synth/selector'
import {
  addNetworkMM,
  addNetworkBC,
  getSpartaPrice,
  getEventArray,
} from '../../store/web3'
import { changeNetwork } from '../../utils/web3'
import {
  getBondContract,
  getDaoContract,
  getPoolContract,
  getRouterContract,
  getSynthContract,
} from '../../utils/web3Contracts'

const DataManager = () => {
  const synth = useSynth()
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()
  const wallet = useWallet()
  const [prevNetwork, setPrevNetwork] = useState(
    JSON.parse(window.localStorage.getItem('network')),
  )

  /**
   * On DApp load check network and get the party started
   */
  useEffect(() => {
    const checkNetwork = async () => {
      if (prevNetwork.net === 'mainnet' || prevNetwork.net === 'testnet') {
        changeNetwork(prevNetwork.net)
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getListedTokens()) // TOKEN ARRAY
        dispatch(getCuratedPools()) // CURATED ARRAY
      } else {
        changeNetwork('testnet') // CHANGE TO MAINNET AFTER DEPLOY
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        dispatch(getListedTokens()) // TOKEN ARRAY
        dispatch(getCuratedPools()) // CURATED ARRAY
      }
    }
    checkNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Check SPARTA token price
   */
  const [trigger1, settrigger1] = useState(0)
  useEffect(() => {
    if (trigger1 === 0) {
      dispatch(getSpartaPrice())
    }
    const timer = setTimeout(() => {
      dispatch(getSpartaPrice())
      settrigger1(trigger1 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

  /**
   * Trigger array refresh on network change
   */
  useEffect(() => {
    const checkArrays = () => {
      if (
        JSON.parse(window.localStorage.getItem('network')).net !==
        prevNetwork.net
      ) {
        setPrevNetwork(JSON.parse(window.localStorage.getItem('network')))
        dispatch(getListedTokens()) // TOKEN ARRAY
        dispatch(getCuratedPools()) // CURATED ARRAY
      }
    }
    checkArrays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

  /**
   * Update synthArray & tokenDetails
   */
  const [trigger2, settrigger2] = useState(0)
  useEffect(() => {
    const { listedTokens } = poolFactory
    if (trigger2 === 0) {
      dispatch(getSynthArray(listedTokens))
      dispatch(getTokenDetails(listedTokens, wallet.account))
    }
    const timer = setTimeout(() => {
      if (listedTokens.length > 0) {
        dispatch(getSynthArray(listedTokens))
        dispatch(getTokenDetails(listedTokens, wallet.account))
        settrigger2(trigger2 + 1)
      }
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.listedTokens, wallet.account, trigger2])

  /**
   * Get listed pools details
   */
  useEffect(() => {
    const { tokenDetails } = poolFactory
    const { curatedPools } = poolFactory
    const checkListedPools = () => {
      if (tokenDetails.length > 0) {
        dispatch(getListedPools(tokenDetails, curatedPools))
      }
    }
    checkListedPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.tokenDetails])

  const [prevFinalLpArray, setPrevFinalLpArray] = useState(
    poolFactory.finalLpArray,
  )

  /**
   * Get final pool details
   */
  useEffect(() => {
    const { listedPools } = poolFactory
    const { synthArray } = synth
    const checkDetails = () => {
      if (listedPools?.length > 0) {
        dispatch(getPoolDetails(listedPools, wallet.account))
      }
      if (synthArray?.length > 0 && listedPools?.length > 0) {
        dispatch(getSynthDetails(synthArray, listedPools, wallet.account))
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.listedPools])

  /**
   * Update bondVault member details
   */
  useEffect(() => {
    const { finalLpArray } = poolFactory
    const checkBondArray = () => {
      if (finalLpArray?.length > 0) {
        dispatch(getBondVaultMemberDetails(wallet.account, finalLpArray))
        setPrevFinalLpArray(poolFactory.finalLpArray)
      }
    }
    checkBondArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.finalLpArray])

  /**
   * Listen to all contracts
   */
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

  /**
   * Update store whenever a new txn is picked up
   */
  useEffect(() => {
    dispatch(getEventArray(eventArray))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventArray])

  return <></>
}

export default DataManager
