import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAccount } from 'wagmi'
import {
  getCuratedPools,
  getListedTokens,
  updateTxn as updateTxnPool,
  usePool,
} from '../../../store/pool'
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
import { useSynth, updateTxn as updateTxnSynth } from '../../../store/synth'
import {
  getRPCBlocks,
  getSpartaPrice,
  useWeb3,
  // getGlobalMetrics,
  updateTxn as updateTxnWeb3,
} from '../../../store/web3'
import { addTxn, liveChains } from '../../../utils/web3'
import { useApp } from '../../../store/app'
import { getReservePOLDetails } from '../../../store/reserve'

const DataManager = () => {
  const dispatch = useDispatch()

  const app = useApp()
  const dao = useDao()
  const pool = usePool()
  const router = useRouter()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()
  const { address } = useAccount()

  /** Get the current block from a main RPC */
  useEffect(() => {
    const checkRpcs = () => {
      dispatch(getRPCBlocks())
      // dispatch(getGlobalMetrics())
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
      dispatch(getListedTokens(address)) // TOKEN ARRAY
      dispatch(getCuratedPools()) // CURATED ARRAY
      dispatch(getSpartaGlobalDetails()) // SPARTA GLOBAL DETAILS
      dispatch(getReservePOLDetails()) // RESERVE POL DETAILS
    }
  }, [dispatch, web3.rpcs, app.chainId, address])

  /** Check SPARTA token price */
  useEffect(() => {
    dispatch(getSpartaPrice()) // Run on load
    const interval = setInterval(() => {
      dispatch(getSpartaPrice()) // Run on interval
    }, 20000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  /** Update txnArray whenever a new dao txn is picked up */
  useEffect(() => {
    if (dao.txn.txnType) {
      addTxn(address, dao.txn)
      dispatch(updateTxnDao([]))
    }
  }, [dao.txn, dispatch, address])

  /** Update txnArray whenever a new dao-proposal txn is picked up */
  useEffect(() => {
    if (dao.propTxn.txnType) {
      addTxn(address, dao.propTxn)
      dispatch(updateTxnProposal([]))
    }
  }, [dao.propTxn, dispatch, address])

  /** Update txnArray whenever a new pool txn is picked up */
  useEffect(() => {
    if (pool.txn.txnType) {
      addTxn(address, pool.txn)
      dispatch(updateTxnPool([]))
    }
  }, [dispatch, pool.txn, address])

  /** Update txnArray whenever a new router txn is picked up */
  useEffect(() => {
    if (router.txn.txnType) {
      addTxn(address, router.txn)
      dispatch(updateTxnRouter([]))
    }
  }, [dispatch, router.txn, address])

  /** Update txnArray whenever a new sparta txn is picked up */
  useEffect(() => {
    if (sparta.txn.txnType) {
      addTxn(address, sparta.txn)
      dispatch(updateTxnSparta([]))
    }
  }, [dispatch, sparta.txn, address])

  /** Update txnArray whenever a new synth txn is picked up */
  useEffect(() => {
    if (synth.txn.txnType) {
      addTxn(address, synth.txn)
      dispatch(updateTxnSynth([]))
    }
  }, [dispatch, synth.txn, address])

  /** Update txnArray whenever a new web3/misc txn is picked up */
  useEffect(() => {
    if (web3.txn.txnType) {
      addTxn(address, web3.txn)
      dispatch(updateTxnWeb3([]))
    }
  }, [dispatch, address, web3.txn])

  return <></>
}

export default DataManager
