import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { bondGlobalDetails } from '../../store/bond'
import {
  getCuratedPools,
  getListedPools,
  getListedTokens,
  getMonthIncentives,
  getPoolDetails,
  getTokenDetails,
  usePool,
} from '../../store/pool'
import { getReserveGlobalDetails } from '../../store/reserve'
import { useRouter } from '../../store/router/selector'
import { useBond } from '../../store/bond/selector'
import { useDao } from '../../store/dao/selector'
import { useSynth } from '../../store/synth/selector'
import {
  getSpartaGlobalDetails,
  spartaFeeBurnRecent,
  spartaFeeBurnTally,
  useSparta,
} from '../../store/sparta'
import { getSynthArray } from '../../store/synth'
import { getRPCBlocks, getSpartaPrice, useWeb3 } from '../../store/web3'
import { BN } from '../../utils/bigNumber'
import {
  addTxn,
  changeNetwork,
  getAddresses,
  getNetwork,
  liveChains,
  tempChains,
} from '../../utils/web3'
import { getSpartaV2Contract } from '../../utils/web3Contracts'
import { getGlobalMetrics } from '../../store/web3/actions'

const DataManager = () => {
  const dispatch = useDispatch()
  const wallet = useWeb3React()

  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const router = useRouter()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()

  const addr = getAddresses()

  const [prevNetwork, setPrevNetwork] = useState(false)
  const [netLoading, setnetLoading] = useState(false)

  const [trigger1, settrigger1] = useState(0)
  const [trigger2, settrigger2] = useState(0)
  const [trigger3, settrigger3] = useState(0)

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork(null, web3.rpcs)
    }
  }

  /** Get feeBurn tally *JUST ONCE* on load */
  const [addFeeBurn, setaddFeeBurn] = useState('0')
  useEffect(() => {
    dispatch(spartaFeeBurnTally())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Get the current block from a main RPC */
  const getBlockTimer = useRef(null)
  useEffect(() => {
    const getSubGraphData = () => {
      dispatch(getRPCBlocks())
      dispatch(getGlobalMetrics())
    }
    getSubGraphData() // Run on load
    getBlockTimer.current = setInterval(async () => {
      getSubGraphData()
    }, 20000)
    return () => clearInterval(getBlockTimer.current)
  }, [dispatch, getBlockTimer])

  useEffect(() => {
    const contract = getSpartaV2Contract(null, web3.rpcs)
    const filter = contract.filters.Transfer(null, addr.bnb)
    const listen = async () => {
      await contract.on(filter, (from, to, amount) => {
        setaddFeeBurn(BN(addFeeBurn).plus(amount.toString()))
      })
    }
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

  /** On DApp load check network and get the party started */
  const checkNetwork = async () => {
    const network = tryParse(window.localStorage.getItem('network'))
    if (netLoading === false) {
      setnetLoading(true)
      if (network?.chainId !== prevNetwork?.chainId) {
        changeNetwork(network?.chainId, web3.rpcs)
        settrigger1(0)
        setPrevNetwork(tryParse(network))
      } else {
        setPrevNetwork(tryParse(network))
      }
      setnetLoading(false)
    }
  }
  useEffect(() => {
    checkNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem('network')])

  /** Get the initial arrays (tokens, curated & global details) */
  const checkArrays = async () => {
    const chainId = tryParse(window.localStorage.getItem('network'))?.chainId
    if (liveChains.includes(chainId)) {
      dispatch(getListedTokens(web3.rpcs)) // TOKEN ARRAY
      dispatch(getCuratedPools(web3.rpcs)) // CURATED ARRAY
      dispatch(getSpartaGlobalDetails(web3.rpcs)) // SPARTA GLOBAL DETAILS
      dispatch(bondGlobalDetails(web3.rpcs)) // BOND GLOBAL DETAILS
      dispatch(getReserveGlobalDetails(web3.rpcs)) // RESERVE GLOBAL DETAILS
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

  /** Get the 30d rolling incentives for curated pools */
  useEffect(() => {
    if (pool.curatedPools) {
      dispatch(getMonthIncentives(pool.curatedPools))
    }
  }, [dispatch, pool.curatedPools])

  /** Check SPARTA token price */
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

  /** Update synthArray & tokenDetails */
  const checkArraysNext = async () => {
    const { listedTokens } = pool
    const chainId = tryParse(window.localStorage.getItem('network'))?.chainId
    if (listedTokens.length > 0) {
      if (liveChains.includes(chainId)) {
        dispatch(getSynthArray(listedTokens, web3.rpcs))
        dispatch(getTokenDetails(listedTokens, wallet, chainId, web3.rpcs))
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
    }, 7500)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedTokens, trigger3, wallet.account])

  /** Get listed pools details */
  useEffect(() => {
    const { tokenDetails } = pool
    const checkListedPools = () => {
      if (tokenDetails && tokenDetails.length > 0) {
        dispatch(getListedPools(tokenDetails, web3.rpcs))
      }
    }
    checkListedPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.tokenDetails])

  /** Get final pool details */
  useEffect(() => {
    const { listedPools, curatedPools } = pool
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (listedPools?.length > 0) {
          dispatch(getPoolDetails(listedPools, curatedPools, wallet, web3.rpcs))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  /** Update txnArray whenever a new bond txn is picked up */
  useEffect(() => {
    if (bond.txn.txnType) {
      addTxn(wallet.account, bond.txn)
      bond.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bond.txn])

  /** Update txnArray whenever a new dao txn is picked up */
  useEffect(() => {
    if (dao.txn.txnType) {
      addTxn(wallet.account, dao.txn)
      dao.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.txn])

  /** Update txnArray whenever a new dao-proposal txn is picked up */
  useEffect(() => {
    if (dao.propTxn.txnType) {
      addTxn(wallet.account, dao.propTxn)
      dao.propTxn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.propTxn])

  /** Update txnArray whenever a new pool txn is picked up */
  useEffect(() => {
    if (pool.txn.txnType) {
      addTxn(wallet.account, pool.txn)
      pool.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.txn])

  /** Update txnArray whenever a new router txn is picked up */
  useEffect(() => {
    if (router.txn.txnType) {
      addTxn(wallet.account, router.txn)
      router.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.txn])

  /** Update txnArray whenever a new sparta txn is picked up */
  useEffect(() => {
    if (sparta.txn.txnType) {
      addTxn(wallet.account, sparta.txn)
      sparta.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sparta.txn])

  /** Update txnArray whenever a new synth txn is picked up */
  useEffect(() => {
    if (synth.txn.txnType) {
      addTxn(wallet.account, synth.txn)
      synth.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.txn])

  /** Update txnArray whenever a new web3/misc txn is picked up */
  useEffect(() => {
    if (web3.txn.txnType) {
      addTxn(wallet.account, web3.txn)
      web3.txn = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.txn])

  return <></>
}

export default DataManager
