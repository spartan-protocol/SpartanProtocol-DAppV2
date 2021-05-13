import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  getCuratedPools,
  getListedPools,
  getListedTokens,
  getPoolDetails,
  getTokenDetails,
  usePool,
} from '../../store/pool'
import { getSynthArray, getSynthDetails } from '../../store/synth/actions'
import { useSynth } from '../../store/synth/selector'
import {
  addNetworkMM,
  addNetworkBC,
  getSpartaPrice,
  getEventArray,
} from '../../store/web3'
import { changeNetwork, getNetwork } from '../../utils/web3'
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
  const pool = usePool()
  const wallet = useWallet()

  const getSynth = (tokenAddress) =>
    synth.synthDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const [prevNetwork, setPrevNetwork] = useState(false)
  const [netLoading, setnetLoading] = useState(false)

  const [trigger1, settrigger1] = useState(0)
  const [trigger2, settrigger2] = useState(0)
  const [trigger3, settrigger3] = useState(0)

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork()
    }
  }

  /**
   * On DApp load check network and get the party started
   */
  const checkNetwork = async () => {
    if (netLoading === false) {
      setnetLoading(true)
      if (
        tryParse(window.localStorage.getItem('network'))?.chainId !==
        prevNetwork?.chainId
      ) {
        changeNetwork(tryParse(window.localStorage.getItem('network'))?.chainId)
        settrigger1(0)
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        setPrevNetwork(tryParse(window.localStorage.getItem('network')))
      } else {
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        setPrevNetwork(tryParse(window.localStorage.getItem('network')))
      }
      setnetLoading(false)
    }
  }
  useEffect(() => {
    checkNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

  /**
   * Get the initial arrays (tokens & curateds)
   */
  const checkArrays = async () => {
    if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
      dispatch(getListedTokens()) // TOKEN ARRAY
      dispatch(getCuratedPools()) // CURATED ARRAY
    }
  }
  useEffect(() => {
    if (
      trigger1 === 0 &&
      tryParse(window.localStorage.getItem('network'))?.chainId === 97
    ) {
      checkArrays()
      settrigger1(trigger1 + 1)
    }
    const timer = setTimeout(() => {
      checkArrays()
      settrigger1(trigger1 + 1)
    }, 10000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network'), trigger1])

  /**
   * Check SPARTA token price
   */
  useEffect(() => {
    if (trigger2 === 0) {
      dispatch(getSpartaPrice())
    }
    const timer = setTimeout(() => {
      dispatch(getSpartaPrice())
      settrigger2(trigger2 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger2])

  /**
   * Update synthArray & tokenDetails
   */
  useEffect(() => {
    const { listedTokens } = pool
    if (
      trigger3 === 0 &&
      tryParse(window.localStorage.getItem('network'))?.chainId === 97
    ) {
      dispatch(getSynthArray(listedTokens))
      dispatch(getTokenDetails(listedTokens, wallet.account))
    }
    const timer = setTimeout(() => {
      if (listedTokens.length > 0) {
        dispatch(getSynthArray(listedTokens))
        dispatch(getTokenDetails(listedTokens, wallet.account))
        settrigger3(trigger3 + 1)
      }
    }, 7500)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedTokens, wallet.account, trigger3])

  /**
   * Get listed pools details
   */
  useEffect(() => {
    const { tokenDetails } = pool
    const { curatedPools } = pool
    const checkListedPools = () => {
      if (tokenDetails && tokenDetails.length > 0) {
        dispatch(getListedPools(tokenDetails, curatedPools))
      }
    }
    checkListedPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.tokenDetails])

  const [prevPoolDetails, setPrevPoolDetails] = useState('')

  /**
   * Get final pool details
   */
  useEffect(() => {
    const { listedPools } = pool
    const { synthArray } = synth
    const checkDetails = () => {
      if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
        if (listedPools?.length > 0) {
          dispatch(getPoolDetails(listedPools, wallet.account))
          setPrevPoolDetails(pool.poolDetails)
        }
        if (synthArray?.length > 0 && listedPools?.length > 0) {
          dispatch(getSynthDetails(synthArray, listedPools, wallet.account))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  /**
   * Listen to all contracts
   */
  const [eventArray, setEventArray] = useState([])
  useEffect(() => {
    let contracts = []
    const { poolDetails } = pool
    if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
      contracts = [getBondContract(), getRouterContract(), getDaoContract()]
    }

    const listen = async (contract) => {
      await contract.on('*', (eventObject) => {
        setEventArray((oldArray) => [...oldArray, eventObject])
        console.log(eventObject)
      })
    }

    const mapOut = () => {
      if (
        poolDetails?.length !== prevPoolDetails?.length &&
        poolDetails?.length > 0
      ) {
        for (let i = 0; i < poolDetails.length; i++) {
          if (poolDetails[i]?.address) {
            contracts.push(getPoolContract(poolDetails[i].address))
          }
          if (getSynth(poolDetails[i].tokenAddress)?.address) {
            contracts.push(
              getSynthContract(getSynth(poolDetails[i].tokenAddress)?.address),
            )
          }
        }

        for (let i = 0; i < contracts.length; i++) {
          listen(contracts[i])
        }
      }
    }
    mapOut()
    return () => {
      for (let i = 0; i < contracts.length; i++) {
        try {
          contracts[i]?.removeAllListeners()
        } catch (e) {
          console.log(e)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

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
