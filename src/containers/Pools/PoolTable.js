/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import PoolTableItem from './PoolTableItem'
import styles from './styles.module.scss'
import { getToken } from '../../utils/math/utils'
import { usePool } from '../../store/pool'
import { calcAPY } from '../../utils/math/nonContract'
import { BN, convertFromWei } from '../../utils/bigNumber'

const PoolTable = ({ poolItems, daoApy }) => {
  const { t } = useTranslation()
  const pool = usePool()

  const [tableItems, setTableItems] = useState(poolItems)
  const [sortBy, setSortBy] = useState({ value: 'liquidity', order: 'desc' })

  const poolCapTooltip = Tooltip(t, 'poolCap')

  const sortTable = (column) => {
    let order = sortBy.order === 'desc' ? 'asc' : 'desc'
    if (sortBy.value === column) {
      setSortBy({ value: column, order })
    } else {
      order = 'desc'
      setSortBy({ value: column, order })
    }
  }

  const sortPool = () => {
    // logic to sort by pool name
    const finalArray = tableItems.sort((a, b) => {
      const _a = getToken(a.tokenAddress, pool.tokenDetails).symbol
      const _b = getToken(b.tokenAddress, pool.tokenDetails).symbol
      const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
      if (first > second) {
        return 1
      }
      if (second > first) {
        return -1
      }
      return 0
    })
    setTableItems(finalArray)
  }

  const sortTvl = () => {
    // logic to sort by pool liquidity && caps
    const finalArray = tableItems.sort((a, b) => {
      const _a = a.baseAmount
      const _b = b.baseAmount
      const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
      return first - second
    })
    setTableItems(finalArray)
  }

  const sortVol = () => {
    // logic to sort by pool volume
    const finalArray = tableItems.sort((a, b) => {
      const _a = pool.incentives.filter((x) => x.address === a.address)[0]
        .volume
      const _b = pool.incentives.filter((x) => x.address === b.address)[0]
        .volume
      const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
      return first - second
    })
    setTableItems(finalArray)
  }

  const sortApy = () => {
    // logic to sort by pool APY

    const finalArray = tableItems.sort((a, b) => {
      const _a = pool.incentives.filter((x) => x.address === a.address)[0]
      const _b = pool.incentives.filter((x) => x.address === b.address)[0]
      let apyA = calcAPY(a, _a.fees, _a.incentives)
      apyA = a.curated && daoApy ? BN(apyA).plus(daoApy) : apyA
      let apyB = calcAPY(b, _b.fees, _b.incentives)
      apyB = b.curated && daoApy ? BN(apyB).plus(daoApy) : apyB
      const [first, second] =
        sortBy.order === 'desc' ? [apyB, apyA] : [apyA, apyB]
      return first - second
    })
    setTableItems(finalArray)
  }

  useEffect(() => {
    // Whenever 'sortBy' changes, re-order the table
    if (sortBy.value === 'poolName') {
      sortPool()
    } else if (sortBy.value === 'liquidity') {
      sortTvl()
    } else if (sortBy.value === 'volume') {
      sortVol()
    } else if (sortBy.value === 'apy') {
      sortApy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  useEffect(() => {}, [tableItems])

  return (
    <Table className={`${styles.poolTable} table-borderless`}>
      <thead>
        <tr className={`${styles.poolTableItem} bg-2`}>
          <th
            className="user-select-none"
            role="button"
            onClick={() => sortTable('poolName')}
          >
            <Icon
              icon="sort"
              height="14"
              width="20"
              fill="grey"
              className={
                sortBy.value === 'poolName'
                  ? sortBy.order === 'desc'
                    ? 'orderDesc'
                    : 'orderAsc'
                  : ''
              }
            />
            {t('pool')}
          </th>
          <th
            className="user-select-none"
            role="button"
            onClick={() => sortTable('poolName')}
          />
          <th
            className="d-none d-md-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('liquidity')}
          >
            {t('poolCap')}
            <OverlayTrigger placement="auto" overlay={poolCapTooltip}>
              <span role="button">
                <Icon icon="info" className="ms-1 mb-1" size="17" />
              </span>
            </OverlayTrigger>
          </th>
          <th
            className="d-none d-sm-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('liquidity')}
          >
            <Icon
              icon="sort"
              height="14"
              width="20"
              fill="grey"
              className={
                sortBy.value === 'liquidity'
                  ? sortBy.order === 'desc'
                    ? 'orderDesc'
                    : 'orderAsc'
                  : ''
              }
            />
            {t('liquidity')}
          </th>
          <th
            className="d-none d-sm-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('volume')}
          >
            <Icon
              icon="sort"
              height="14"
              width="20"
              fill="grey"
              className={
                sortBy.value === 'volume'
                  ? sortBy.order === 'desc'
                    ? 'orderDesc'
                    : 'orderAsc'
                  : ''
              }
            />
            Vol 24hr
          </th>
          <th
            className="user-select-none"
            role="button"
            onClick={() => sortTable('apy')}
          >
            <Icon
              icon="sort"
              height="14"
              width="20"
              fill="grey"
              className={
                sortBy.value === 'apy'
                  ? sortBy.order === 'desc'
                    ? 'orderDesc'
                    : 'orderAsc'
                  : ''
              }
            />
            APY
            <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
              <span role="button">
                <Icon icon="info" className="ms-1 mb-1" size="17" />
              </span>
            </OverlayTrigger>
          </th>
          <th className="" />
        </tr>
      </thead>
      <tbody>
        {tableItems.map((asset) => (
          <PoolTableItem key={asset.address} asset={asset} daoApy={daoApy} />
        ))}
      </tbody>
    </Table>
  )
}

export default PoolTable
