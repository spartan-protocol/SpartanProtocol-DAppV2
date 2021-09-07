import React, { useEffect, useState } from 'react'
import { Row, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getExplorerTxn } from '../../utils/extCalls'
import { formatShortString } from '../../utils/web3'

const RecentTxns = () => {
  const wallet = useWallet()
  const { t } = useTranslation()

  const [txnArray, setTxnArray] = useState([])

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return false
    }
  }

  const getTxns = () => {
    const unfiltered = tryParse(window.localStorage.getItem('txnArray'))
    if (!unfiltered) {
      return []
    }
    return unfiltered
  }

  useEffect(() => {
    const unfiltered = getTxns()
    const network = tryParse(window.localStorage.getItem('network'))
    if (unfiltered.length > 0 && wallet.account) {
      let filtered = unfiltered.filter(
        (group) => group.wallet === wallet.account,
      )[0]?.txns
      if (filtered?.length > 0) {
        filtered = filtered.filter((txn) => txn[1]?.chainId === network.chainId)
        setTxnArray(filtered)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account, window.localStorage.getItem('txnArray')])

  return (
    <>
      <Row>
        <Table borderless striped className="m-3">
          <thead className="text-primary text-center">
            <tr>
              <th>{t('type')}</th>
              <th>{t('txHash')}</th>
            </tr>
          </thead>
          <tbody>
            {txnArray?.length > 0 &&
              wallet.account &&
              txnArray?.map((txn) => (
                <tr key={txn[1].hash} className="text-center">
                  <td>{txn[0]}</td>
                  <td>
                    <a
                      href={getExplorerTxn(txn[1].hash)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatShortString(txn[1].hash)}
                    </a>
                  </td>
                </tr>
              ))}
            {/* {web3.eventArray?.length > 0 &&
              web3.eventArray
                ?.filter((e) => e.event !== 'Transfer')
                .map((txn) => (
                  <tr
                    key={txn.transactionHash + txn.event + txn.logIndex}
                    className="text-center"
                  >
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
                ))} */}
          </tbody>
        </Table>
      </Row>
    </>
  )
}

export default RecentTxns
