import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { Row, Table, Button } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'
import { useTranslation } from 'react-i18next'
import { getExplorerTxn } from '../../utils/extCalls'
import { clearTxns, formatShortString } from '../../utils/web3'

const RecentTxns = () => {
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const [txnArray, setTxnArray] = useState([])
  const [shownArray, setShownArray] = useState([])
  const [active, setActive] = useState(1)
  const [txnsPerPage, setTxnsPerPage] = useState(6)

  useEffect(() => {
    const drawerHeight = document.querySelector('#txnDrawer').offsetHeight
    const rows = Math.floor(drawerHeight / 55)
    setTxnsPerPage(rows)
  }, [])

  const handleOnClick = (elem) => {
    setActive(elem)
  }
  const [items, setItems] = useState([])

  const createPagination = (len) => {
    let newItem
    let auxItems = []
    for (let number = 1; number <= len; number++) {
      newItem = (
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => handleOnClick(number)}
        >
          {number}
        </Pagination.Item>
      )
      auxItems = [...auxItems, newItem]
    }
    setItems(auxItems)
  }

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

  const updateFiltered = () => {
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
      // TODO change the txnsPerPage depending on device
    }
  }
  useEffect(() => {
    updateFiltered()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, wallet.account])

  const updateShown = () => {
    let amountOfPages = 0
    if (txnArray.length > 0 && wallet.account) {
      setShownArray(
        txnArray.slice((active - 1) * txnsPerPage, active * txnsPerPage),
      )
      amountOfPages = Math.ceil(txnArray.length / txnsPerPage)
      createPagination(amountOfPages)
      // TODO change the txnsPerPage depending on device
    }
  }
  useEffect(() => {
    updateShown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnArray])

  return (
    <>
      <Row>
        <Table borderless striped className="m-3">
          <thead className="text-primary text-center">
            <tr>
              <th>{t('type')}</th>
              <th>{t('input')}</th>
              <th>{t('output')}</th>
              <th>{t('txHash')}</th>
            </tr>
          </thead>
          <tbody>
            {shownArray?.length > 0 &&
              wallet.account &&
              shownArray?.map((txn) => (
                <tr key={txn[1].hash} className="text-center output-card">
                  <td>{txn[0]}</td>
                  <td>#,###.#### TOKEN</td>
                  <td>#,###.#### TOKEN</td>
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
          </tbody>
        </Table>
        <div
          className="pagAndDel"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pagination>
            <Pagination.First onClick={() => handleOnClick(1)} />
            <Pagination.Prev
              onClick={() => active > 1 && handleOnClick(active - 1)}
            />
            {items[active - 1]}
            {items[active]}
            <Pagination.Next onClick={() => handleOnClick(active + 1)} />
          </Pagination>
          <Button
            className="clearTxns"
            style={{
              float: 'left',
              marginBottom: '16px',
              marginLeft: '8px',
            }}
            onClick={() => clearTxns(wallet.account)}
          >
            {t('clearTxns')}
          </Button>
        </div>
      </Row>
    </>
  )
}

export default RecentTxns

/* {web3.eventArray?.length > 0 &&
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
                ))} */
