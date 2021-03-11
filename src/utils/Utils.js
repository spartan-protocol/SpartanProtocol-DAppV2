/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useUtils, getListedPools } from '../store/utils'

const Utils = () => {
  const utils = useUtils()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getListedPools())
  }, [dispatch])

  return (
    <>
      <div className="content">
        <h2>Pool listed</h2>
        {utils.pools.map((pool, i) => (
          <p key={`pool-${i}`}>{pool}</p>
        ))}
      </div>
    </>
  )
}

export default Utils
