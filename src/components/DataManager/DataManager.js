import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { bondGlobalDetails } from '../../store/bond'
import {
  getListedPools,
  getListedTokens,
  getPoolDetails,
  getTokenDetails,
  usePool,
} from '../../store/pool'
import { getReserveGlobalDetails } from '../../store/reserve/actions'
import {
  getSpartaGlobalDetails,
  spartaFeeBurnRecent,
  spartaFeeBurnTally,
} from '../../store/sparta/actions'
import { getSynthArray, getSynthDetails } from '../../store/synth/actions'
import { useSynth } from '../../store/synth/selector'
import {
  addNetworkMM,
  addNetworkBC,
  getSpartaPrice,
  // getEventArray,
} from '../../store/web3'
import { BN } from '../../utils/bigNumber'
import { changeNetwork, getAddresses, getNetwork } from '../../utils/web3'
import { getSpartaV2Contract } from '../../utils/web3Contracts'
// import {
//   getBondContract,
//   getDaoContract,
//   getPoolContract,
//   getRouterContract,
//   getSynthContract,
// } from '../../utils/web3Contracts'

const DataManager = () => {
  const synth = useSynth()
  const dispatch = useDispatch()
  const pool = usePool()
  const wallet = useWallet()
  const addr = getAddresses()

  // const getSynth = (tokenAddress) =>
  //   synth.synthDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

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
   * Get feeBurn tally *JUST ONCE* on load
   */
  const [addFeeBurn, setaddFeeBurn] = useState('0')
  useEffect(() => {
    const contract = getSpartaV2Contract()
    const filter = contract.filters.Transfer(null, addr.bnb)
    const listen = async () => {
      await contract.on(filter, (from, to, amount) => {
        setaddFeeBurn(BN(addFeeBurn).plus(amount.toString()))
      })
    }
    dispatch(spartaFeeBurnTally())
    listen()
    return () => {
      try {
        contract.removeAllListeners(filter)
      } catch (e) {
        console.log(e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFeeBurn])

  useEffect(() => {
    dispatch(spartaFeeBurnRecent(addFeeBurn))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFeeBurn])

  /**
   * On DApp load check network and get the party started
   */
  const checkNetwork = async () => {
    const network = tryParse(window.localStorage.getItem('network'))
    if (netLoading === false) {
      setnetLoading(true)
      if (network?.chainId !== prevNetwork?.chainId) {
        changeNetwork(network?.chainId)
        settrigger1(0)
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        setPrevNetwork(tryParse(network))
      } else {
        await dispatch(addNetworkMM())
        dispatch(addNetworkBC())
        setPrevNetwork(tryParse(network))
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
    const chainId = tryParse(window.localStorage.getItem('network'))?.chainId
    if (chainId === 97 || chainId === 56) {
      dispatch(getListedTokens(wallet)) // TOKEN ARRAY
      dispatch(getSpartaGlobalDetails(wallet))
      dispatch(bondGlobalDetails(wallet))
      dispatch(getReserveGlobalDetails(wallet))
    }
  }
  useEffect(() => {
    if (trigger1 === 0) {
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
  const checkArraysNext = async () => {
    const { listedTokens } = pool
    const chainId = tryParse(window.localStorage.getItem('network'))?.chainId
    if (listedTokens.length > 0) {
      if (chainId === 97 || chainId === 56) {
        dispatch(getSynthArray(listedTokens, wallet))
        dispatch(getTokenDetails(listedTokens, wallet))
      }
    }
  }
  useEffect(() => {
    if (trigger3 === 0) {
      checkArraysNext()
    }
    const timer = setTimeout(() => {
      checkArraysNext()
      settrigger3(trigger3 + 1)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('network'),
    pool.listedTokens,
    wallet.account,
    trigger3,
  ])

  /**
   * Get listed pools details
   */
  useEffect(() => {
    const { tokenDetails } = pool
    const checkListedPools = () => {
      if (tokenDetails && tokenDetails.length > 0) {
        dispatch(getListedPools(tokenDetails, wallet))
      }
    }
    checkListedPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.tokenDetails])

  // const [prevPoolDetails, setPrevPoolDetails] = useState('')

  /**
   * Get final pool details
   */
  useEffect(() => {
    const { listedPools } = pool
    const { synthArray } = synth
    const checkDetails = () => {
      if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
        if (listedPools?.length > 0) {
          dispatch(getPoolDetails(listedPools, wallet))
          // setPrevPoolDetails(pool.poolDetails)
        }
        if (synthArray?.length > 0 && listedPools?.length > 0) {
          dispatch(getSynthDetails(synthArray, listedPools, wallet))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  // /**
  //  * Listen to all contracts
  //  */
  // const [eventArray, setEventArray] = useState([])
  // useEffect(() => {
  //   let contracts = []
  //   const { poolDetails } = pool
  //   if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
  //     contracts = [
  //       getBondContract(wallet),
  //       getRouterContract(wallet),
  //       getDaoContract(wallet),
  //     ]
  //   }

  //   const listen = async (contract) => {
  //     await contract.on('*', (eventObject) => {
  //       console.log(eventObject)
  //       setEventArray((oldArray) => [...oldArray, eventObject])
  //     })
  //   }

  //   const mapOut = () => {
  //     if (
  //       poolDetails?.length !== prevPoolDetails?.length &&
  //       poolDetails?.length > 0
  //     ) {
  //       for (let i = 0; i < poolDetails.length; i++) {
  //         if (poolDetails[i]?.address) {
  //           contracts.push(getPoolContract(poolDetails[i].address, wallet))
  //         }
  //         if (getSynth(poolDetails[i].tokenAddress)?.address) {
  //           contracts.push(
  //             getSynthContract(
  //               getSynth(poolDetails[i].tokenAddress)?.address,
  //               wallet,
  //             ),
  //           )
  //         }
  //       }

  //       for (let i = 0; i < contracts.length; i++) {
  //         listen(contracts[i])
  //       }
  //     }
  //   }
  //   mapOut()
  //   return () => {
  //     for (let i = 0; i < contracts.length; i++) {
  //       try {
  //         contracts[i]?.removeAllListeners()
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pool.poolDetails])

  // /**
  //  * Update store whenever a new txn is picked up
  //  */
  // useEffect(() => {
  //   dispatch(getEventArray(eventArray))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [eventArray])

  return <></>
}

export default DataManager
