import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import SynthTableItem from './SynthTableItem'
import styles from './styles.module.scss'

const SynthTable = ({ synthItems, synthApy }) => {
  const { t } = useTranslation()
  // TODO: table items have missing poolName, poolCap, volume, liquidity, apy values
  // that's why the sorting is not working
  const [tableItems, setTableItems] = useState(synthItems)
  const [sortBy, setSortBy] = useState({ value: 'pool', order: 'asc' })

  const synthCapTooltip = Tooltip(t, 'synthCap')

  console.log(synthItems)

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
        <tr className={styles.poolTableItem}>
          <th
            className="bg-2 user-select-none"
            role="button"
            onClick={() => sortTable('synthName')}
          >
            {t('synth')}
          </th>
          <th
            className="bg-2 user-select-none"
            role="button"
            onClick={() => sortTable('synthCap')}
          >
            {t('softCap')}
            <OverlayTrigger placement="auto" overlay={synthCapTooltip}>
              <span role="button">
                <Icon icon="info" className="ms-1" size="17" />
              </span>
            </OverlayTrigger>
          </th>
          <th
            className="d-none d-sm-table-cell bg-2 user-select-none"
            role="button"
            onClick={() => sortTable('tokenDepth')}
          >
            {t('tokenDepth')}
          </th>
          <th
            className="d-none d-sm-table-cell bg-2 user-select-none"
            role="button"
            onClick={() => sortTable('synthSupply')}
          >
            {t('synthSupply')}
          </th>
          <th
            className="bg-2 user-select-none"
            role="button"
            onClick={() => sortTable('synthApy')}
          >
            {t('synthApy')}
            <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apyVault')}>
              <span role="button">
                <Icon icon="info" size="17" className="me-1 mb-1" />
              </span>
            </OverlayTrigger>
          </th>
          <th className="bg-2">{t('actions')}</th>
        </tr>
      </thead>
      <tbody>
        {tableItems.map((asset) => (
          <SynthTableItem
            key={asset.address}
            asset={asset}
            synthApy={synthApy}
          />
        ))}
      </tbody>
    </Table>
  )
}

export default SynthTable
