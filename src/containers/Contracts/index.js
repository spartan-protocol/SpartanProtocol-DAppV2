import React from 'react'
import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next'
import { getExplorerContract } from '../../utils/extCalls'
import { ContractsInfo } from './ContractsInfo'
import { formatShortString } from '../../utils/web3'
import { Icon } from '../../components/Icons'
import { useApp } from '../../store/app'

import styles from './styles.module.scss'
import { writeToClipboard } from '../../components/Share/ShareLink'

const Contracts = () => {
  const { t } = useTranslation()

  const { addresses } = useApp()

  return (
    <>
      <Table striped borderless className={styles.table} responsive>
        <thead>
          <tr>
            <th>Contract Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ContractsInfo.filter((contract) => addresses[contract] !== '').map(
            (contract) => (
              <tr key={addresses[contract.addrName]}>
                <td className={styles.firstCol}>
                  <strong>{contract.name}</strong>
                  <br />
                  <span
                    onClick={() =>
                      writeToClipboard(addresses[contract.addrName])
                    }
                    role="button"
                    aria-hidden="true"
                  >
                    {formatShortString(addresses[contract.addrName])}
                    <Icon icon="copy" size="17" className="float-end" />
                  </span>
                  <br />
                  BSCScan
                  <a
                    href={getExplorerContract(addresses[contract.addrName])}
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
