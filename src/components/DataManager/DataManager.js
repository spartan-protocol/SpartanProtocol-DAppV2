import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  usePoolFactory,
  getPoolFactoryTokenCount,
  getPoolFactoryTokenArray,
  getPoolFactoryArray,
  getPoolFactoryCuratedCount,
  getPoolFactoryCuratedArray,
  getPoolFactoryDetailedArray,
  getPoolFactoryFinalArray,
} from '../../store/poolFactory'
import { getNetwork } from '../../utils/web3'
// import { useWeb3 } from '../../store/web3'

const DataManager = () => {
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()
  // const web3 = useWeb3()

  useEffect(() => {
    const checkNetwork = () => {
      dispatch(getNetwork)
    }

    checkNetwork()
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
        dispatch(getPoolFactoryTokenArray(tokenCount))
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

  const [prevPoolArray, setPrevPoolArray] = useState(poolFactory.poolArray)

  useEffect(() => {
    const { tokenArray } = poolFactory
    const checkPoolArray = () => {
      if (tokenArray !== prevTokenArray && tokenArray.length > 0) {
        dispatch(getPoolFactoryArray(tokenArray))
        setPrevPoolArray(poolFactory.poolArray)
        console.log(prevPoolArray)
      }
    }

    checkPoolArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.tokenArray])

  const [prevDetailedArray, setPrevDetailedArray] = useState(
    poolFactory.detailedArray,
  )

  useEffect(() => {
    const { poolArray } = poolFactory
    const checkDetailedArray = () => {
      if (poolArray !== prevPoolArray && poolArray.length > 0) {
        dispatch(getPoolFactoryDetailedArray(poolArray))
        setPrevDetailedArray(poolFactory.detailedArray)
        console.log(prevDetailedArray)
      }
    }

    checkDetailedArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.poolArray])

  const [prevFinalArray, setPrevFinalArray] = useState(poolFactory.finalArray)

  useEffect(() => {
    const { detailedArray } = poolFactory
    const checkDetailedArray = () => {
      if (detailedArray !== setPrevDetailedArray && detailedArray.length > 0) {
        dispatch(
          getPoolFactoryFinalArray(detailedArray, poolFactory.curatedPoolArray),
        )
        setPrevFinalArray(poolFactory.finalArray)
        console.log(prevFinalArray)
      }
    }

    checkDetailedArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.detailedArray])

  return <></>
}

export default DataManager
