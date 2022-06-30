import React from 'react'
import { useTranslation } from 'react-i18next'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import styles from './styles.module.scss'
import { useBreakpoint } from '../../providers/Breakpoint'

const PoolTableHeader = ({ sortBy, sortTable }) => {
  const { t } = useTranslation()

  const breakpoint = useBreakpoint()

  const poolCapTooltip = Tooltip(t, 'poolCap')

  return (
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
          className="text-start user-select-none"
          role={!breakpoint.sm && 'button'}
          onClick={() => !breakpoint.sm && sortTable('liquidity')}
        >
          <span className="d-block d-sm-none">
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
            {t('depth')}
          </span>
        </th>
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
              <Icon
                icon="info"
                className="ms-1 mb-1 d-none d-sm-inline-block"
                size="17"
              />
            </span>
          </OverlayTrigger>
        </th>
        <th />
      </tr>
    </thead>
  )
}

export default PoolTableHeader
