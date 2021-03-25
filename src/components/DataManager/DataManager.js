import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  getPoolFactoryCount,
  getPoolFactoryCuratedArray,
  getPoolFactoryCuratedCount,
  usePoolFactory,
} from '../../store/poolFactory'
// import { BN } from '../../utils/web3Utils'

const DataManager = () => {
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()

  const [prevPoolCount, setPrevPoolCount] = useState(poolFactory.poolCount)
  const [prevCuratedCount, setPrevCuratedCount] = useState(
    poolFactory.curatedPoolCount,
  )

  useEffect(() => {
    const checkCounts = () => {
      dispatch(getPoolFactoryCuratedCount())
      setPrevCuratedCount(poolFactory.curatedPoolCount)
      dispatch(getPoolFactoryCount())
      setPrevPoolCount(poolFactory.poolCount)
    }

    checkCounts()
  }, [dispatch])

  useEffect(() => {
    const curatedCount = poolFactory.curatedPoolCount.toString()
    console.log(prevPoolCount)
    const checkCuratedArray = () => {
      if (
        poolFactory.loading !== true &&
        curatedCount !== prevCuratedCount &&
        curatedCount > 0
      ) {
        console.log('triggered', curatedCount, prevCuratedCount)
        dispatch(getPoolFactoryCuratedArray(curatedCount))
      }
    }

    checkCuratedArray()
  }, [dispatch, poolFactory.curatedPoolCount, prevPoolCount, prevCuratedCount])

  return <></>
}

export default DataManager
