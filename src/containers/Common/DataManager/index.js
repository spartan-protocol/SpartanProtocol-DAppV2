import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  getCuratedPools,
  getListedPools,
  getListedTokens,
  getMonthIncentives,
  getPoolDetails,
  getTokenDetails,
  updateTxn as updateTxnPool,
  usePool,
} from '../../../store/pool'
import { getReserveGlobalDetails } from '../../../store/reserve'
import { updateTxn as updateTxnRouter, useRouter } from '../../../store/router'
import {
  updatePropTxn as updateTxnProposal,
  updateTxn as updateTxnDao,
  useDao,
} from '../../../store/dao'
import {
  getSpartaGlobalDetails,
  updateTxn as updateTxnSparta,
  useSparta,
} from '../../../store/sparta'
import {
  useSynth,
  getSynthArray,
  updateTxn as updateTxnSynth,
} from '../../../store/synth'
import {
  getRPCBlocks,
  getSpartaPrice,
  useWeb3,
  getGlobalMetrics,
  updateTxn as updateTxnWeb3,
} from '../../../store/web3'
import { addTxn, liveChains } from '../../../utils/web3'
import { useApp } from '../../../store/app'

const DataManager = () => {
  const dispatch = useDispatch()
  const wallet = useWeb3React()

  const app = useApp()
  const dao = useDao()
  const pool = usePool()
  const router = useRouter()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()

  /** Get the current block from a main RPC */
  useEffect(() => {
    const checkRpcs = () => {
      dispatch(getRPCBlocks())
      dispatch(getGlobalMetrics())
    }
    checkRpcs() // Run on load
    const interval = setInterval(() => {
      checkRpcs() // Run on interval
    }, 20000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  /** Get the initial arrays (tokens, curated & global details) */
  useEffect(() => {
    if (liveChains.includes(app.chainId)) {
      dispatch(getListedTokens()) // TOKEN ARRAY
      dispatch(getCuratedPools()) // CURATED ARRAY
      dispatch(getSpartaGlobalDetails()) // SPARTA GLOBAL DETAILS
      dispatch(getReserveGlobalDetails()) // RESERVE GLOBAL DETAILS
    }
  }, [dispatch, web3.rpcs, app.chainId])

  /** Check SPARTA token price */
  useEffect(() => {
    dispatch(getSpartaPrice()) // Run on load
    const interval = setInterval(() => {
      dispatch(getSpartaPrice()) // Run on interval
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  /** Update synthArray & tokenDetails */
  useEffect(() => {
    if (liveChains.includes(app.chainId)) {
      dispatch(getSynthArray())
      dispatch(getTokenDetails(wallet, app.chainId))
    }
  }, [dispatch, wallet, pool.listedTokens, app.chainId])

  /** Get listed pools details */
  useEffect(() => {
    dispatch(getListedPools())
  }, [dispatch, pool.tokenDetails])

  /** Get the 30d rolling incentives for all pools */
  useEffect(() => {
    dispatch(getMonthIncentives())
  }, [dispatch, pool.listedPools])

  /** Get final pool details */
  useEffect(() => {
    if (liveChains.includes(app.chainId)) {
      dispatch(getPoolDetails(wallet))
    }
  }, [dispatch, wallet, pool.listedPools, app.chainId])

  /** Update txnArray whenever a new dao txn is picked up */
  useEffect(() => {
    if (dao.txn.txnType) {
      addTxn(wallet.account, dao.txn)
      dispatch(updateTxnDao([]))
    }
  }, [dao.txn, dispatch, wallet.account])

  /** Update txnArray whenever a new dao-proposal txn is picked up */
  useEffect(() => {
    if (dao.propTxn.txnType) {
      addTxn(wallet.account, dao.propTxn)
      dispatch(updateTxnProposal([]))
    }
  }, [dao.propTxn, dispatch, wallet.account])

  /** Update txnArray whenever a new pool txn is picked up */
  useEffect(() => {
    if (pool.txn.txnType) {
      addTxn(wallet.account, pool.txn)
      dispatch(updateTxnPool([]))
    }
  }, [dispatch, pool.txn, wallet.account])

  /** Update txnArray whenever a new router txn is picked up */
  useEffect(() => {
    if (router.txn.txnType) {
      addTxn(wallet.account, router.txn)
      dispatch(updateTxnRouter([]))
    }
  }, [dispatch, router.txn, wallet.account])

  /** Update txnArray whenever a new sparta txn is picked up */
  useEffect(() => {
    if (sparta.txn.txnType) {
      addTxn(wallet.account, sparta.txn)
      dispatch(updateTxnSparta([]))
    }
  }, [dispatch, sparta.txn, wallet.account])

  /** Update txnArray whenever a new synth txn is picked up */
  useEffect(() => {
    if (synth.txn.txnType) {
      addTxn(wallet.account, synth.txn)
      dispatch(updateTxnSynth([]))
    }
  }, [dispatch, synth.txn, wallet.account])

  /** Update txnArray whenever a new web3/misc txn is picked up */
  useEffect(() => {
    if (web3.txn.txnType) {
      addTxn(wallet.account, web3.txn)
      dispatch(updateTxnWeb3([]))
    }
  }, [dispatch, wallet.account, web3.txn])

  return <></>
}

export default DataManager
