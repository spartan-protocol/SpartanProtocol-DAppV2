import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import PoolTableItem from './PoolTableItem'
import styles from './styles.module.scss'

const PoolTable = ({ poolItems, daoApy }) => {
  const { t } = useTranslation()
  const poolCapTooltip = Tooltip(t, 'poolCap')
  // TODO: table items have missing poolName, poolCap, volume, liquidity, apy values
  // that's why the sorting is not working
  const [tableItems, setTableItems] = useState(poolItems)
  const [sortBy, setSortBy] = useState({ value: 'pool', order: 'asc' })

  const sortTable = (column) => {
    let order = sortBy.order === 'desc' ? 'asc' : 'desc'
    if (sortBy.value === column) {
      setSortBy({ value: column, order })
    } else {
      order = 'asc'
      setSortBy({ value: column, order })
    }

    const sortFunction = (a, b) => {
      const x = a[column].toLowerCase()
      const y = b[column].toLowerCase()
      if (order === 'desc') {
        if (x < y) {
          return -1
        }
        if (x > y) {
          return 1
        }
      } else {
        if (x < y) {
          return 1
        }
        if (x > y) {
          return -1
        }
      }
      return 0
    }
    const sortedTableItems = tableItems.sort(sortFunction)
    setTableItems(sortedTableItems)
  }

  return (
    <Table className={`${styles.poolTable} table-borderless`}>
      <thead>
        <tr className={`${styles.poolTableItem} bg-2`}>
          <th className="user-select-none" />
          <th
            className="user-select-none"
            role="button"
            onClick={() => sortTable('poolName')}
          >
            {t('pool')}
          </th>
          <th
            className="d-none d-sm-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('poolCap')}
          >
            {t('poolCap')}
            <OverlayTrigger placement="auto" overlay={poolCapTooltip}>
              <span role="button">
                <Icon icon="info" className="ms-1" size="17" />
              </span>
            </OverlayTrigger>
          </th>
          <th
            className="d-none d-sm-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('liquidity')}
          >
            {t('liquidity')}
          </th>
          <th
            className="d-none d-sm-table-cell user-select-none"
            role="button"
            onClick={() => sortTable('volume')}
          >
            {t('volume')}
          </th>
          <th
            className="user-select-none"
            role="button"
            onClick={() => sortTable('apy')}
          >
            {t('estimatedApy')}
            <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
              <span role="button">
                <Icon icon="info" className="ms-1" size="17" />
              </span>
            </OverlayTrigger>
          </th>
          <th className="">{t('actions')}</th>
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
