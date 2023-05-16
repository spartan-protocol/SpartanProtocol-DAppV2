import React from 'react'
import { useTranslation } from 'react-i18next'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import { Tooltip } from '../../components/Tooltip/index'
// import { Icon } from '../../components/Icons/index'
import styles from './styles.module.scss'

const SynthTableHeader = () => {
  const { t } = useTranslation()

  // const synthCapTooltip = Tooltip(t, 'synthCap')

  return (
    <thead>
      <tr className={`${styles.poolTableItem} bg-2`}>
        <th>{t('synth')}</th>
        <th />
        {/* <th className="d-none d-sm-table-cell">
          {t('softCap')}
          <OverlayTrigger placement="auto" overlay={synthCapTooltip}>
            <span role="button">
              <Icon icon="info" className="ms-1 mb-1" size="17" />
            </span>
          </OverlayTrigger>
        </th> */}
        <th className="d-none d-sm-table-cell">{t('depth')}</th>
        {/* <th>
          APY
          <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apyVault')}>
            <span role="button">
              <Icon icon="info" size="17" className="ms-1 mb-1" />
            </span>
          </OverlayTrigger>
        </th> */}
        <th />
      </tr>
    </thead>
  )
}

export default SynthTableHeader
