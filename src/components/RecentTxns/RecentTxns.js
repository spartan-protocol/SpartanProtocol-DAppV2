import React from 'react'

import { Row, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString, getAddresses } from '../../utils/web3'
import { formatFromWei } from '../../utils/bigNumber'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'

const RecentTxns = () => {
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const { t } = useTranslation()

  console.log(web3)

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  return (
    <>
      <Row>
        <Table borderless striped className="m-3">
          <thead className="text-primary text-center">
            <tr>
              <th>{t('block')}</th>
              <th>{t('event')}</th>
              <th>{t('input')}</th>
              <th>{t('output')}</th>
              <th>{t('txHash')}</th>
            </tr>
          </thead>
          <tbody>
            {web3.eventArray?.length > 0 &&
              web3.eventArray
                ?.filter((e) => e.event !== 'Transfer')
                .map((txn) => (
                  <tr key={txn.transactionHash + txn.event + txn.logIndex}>
                    <td>{txn.blockNumber}</td>
                    <td>{txn.event}</td>
                    <td>
                      {txn.event === 'AddLiquidity' &&
                        `${formatFromWei(
                          txn.args?.inputBase.toString(),
                          2,
                        )} SPARTA : ${formatFromWei(
                          txn.args?.inputToken.toString(),
                          2,
                        )} ${
                          getToken(
                            pool.poolDetails?.filter(
                              (asset) => asset.address === txn.address,
                            )[0].tokenAddress,
                          )?.symbol
                        }`}

                      {txn.event === 'RemoveLiquidity' &&
                        `${formatFromWei(
                          txn.args?.unitsClaimed.toString(),
                          2,
                        )} ${
                          getToken(
                            pool.poolDetails?.filter(
                              (asset) => asset.address === txn.address,
                            )[0].tokenAddress,
                          )?.symbol
                        }p`}
                      {txn.event === 'Swapped' &&
                        `${formatFromWei(
                          txn.args?.inputAmount.toString(),
                          2,
                        )} ${
                          pool.tokenDetails?.filter((asset) => {
                            let targetToken = txn.args.tokenFrom
                            if (targetToken === addr.wbnb) {
                              targetToken = addr.bnb
                            }
                            return asset.address === targetToken
                          })[0]?.symbol
                        }`}
                    </td>
                    <td>
                      {txn.event === 'AddLiquidity' &&
                        `${formatFromWei(
                          txn.args?.unitsIssued.toString(),
                          2,
                        )} ${
                          getToken(
                            pool.poolDetails?.filter(
                              (asset) => asset.address === txn.address,
                            )[0],
                          )?.symbol
                        }p`}
                      {txn.event === 'RemoveLiquidity' &&
                        `${formatFromWei(
                          txn.args?.outputBase.toString(),
                          2,
                        )} SPARTA : ${formatFromWei(
                          txn.args?.outputToken.toString(),
                          2,
                        )} ${
                          getToken(
                            pool.poolDetails?.filter(
                              (asset) => asset.address === txn.address,
                            )[0],
                          )?.symbol
                        }`}
                      {txn.event === 'Swapped' &&
                        `${formatFromWei(
                          txn.args?.outputAmount.toString(),
                          2,
                        )} ${
                          pool.tokenDetails?.filter((asset) => {
                            let targetToken = txn.args.tokenTo
                            if (targetToken === addr.wbnb) {
                              targetToken = addr.bnb
                            }
                            return asset.address === targetToken
                          })[0]?.symbol
                        }`}
                    </td>
                    <td>
                      <a
                        href={getExplorerTxn(txn.transactionHash)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatShortString(txn.transactionHash)}
                      </a>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Row>
    </>
  )
}

export default RecentTxns
