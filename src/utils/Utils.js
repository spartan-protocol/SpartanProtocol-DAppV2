/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useInfo, getListedPools } from '../store/info'

const Utils = () => {
  const info = useInfo()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getListedPools())
  }, [dispatch])

  return (
    <>
      <div className="content">
        <h2>Pool listed</h2>
        {info.pools.map((pool, i) => (
          <p key={`pool-${i}`}>{pool}</p>
        ))}
      </div>
    </>
  )
}

export default Utils
