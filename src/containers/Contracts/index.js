import React from 'react'
import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next'
import { getExplorerContract } from '../../utils/extCalls'
import { ContractsInfo } from './ContractsInfo'
import { formatShortString, getAddresses } from '../../utils/web3'
import { Icon } from '../../components/Icons'
import { useTheme } from '../../providers/Theme'

import styles from './styles.module.scss'
import { writeToClipboard } from '../../components/Share/ShareLink'

const Contracts = () => {
  const addr = getAddresses()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <>
      <Table
        variant={isDark ? 'dark' : null}
        className={styles.table}
        responsive
      >
        <thead>
          <tr>
            <th>Contract Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ContractsInfo.filter((contract) => addr[contract] !== '').map(
            (contract) => (
              <tr>
                <td className={styles.firstCol}>
                  <strong>{contract.name}</strong>
                  <br />
                  <span
                    onClick={() => writeToClipboard(addr[contract.addrName])}
                    role="button"
                    aria-hidden="true"
                  >
                    {formatShortString(addr[contract.addrName])}
                    <Icon icon="copy" size="20" className="float-end" />
                  </span>
                  <br />
                  BSCScan
                  <a
                    href={getExplorerContract(addr[contract.addrName])}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="scan" size="21" className="float-end p-1" />
                  </a>
                </td>
                <td>{t(`${contract.addrName}ContractDescription`)}</td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </>
  )
}

export default Contracts
