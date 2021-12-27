import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { Row, Table, Button } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'
import { useTranslation } from 'react-i18next'
import { getExplorerTxn } from '../../utils/extCalls'
import { clearTxns, formatShortString } from '../../utils/web3'
import { useDao } from '../../store/dao/selector'
import { usePool } from '../../store/pool/selector'
import { useSparta } from '../../store/sparta/selector'
import { useSynth } from '../../store/synth/selector'
import { useRouter } from '../../store/router/selector'
import { useWeb3 } from '../../store/web3/selector'
import { formatFromWei } from '../../utils/bigNumber'
import { getPool, getSynth, getToken } from '../../utils/math/utils'
import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'
import spartaSynthIcon from '../../assets/tokens/sparta-synth.svg'
import HelmetLoading from '../Loaders/HelmetLoading'

// ## NOTES ## //
// Dont forget to add in any new/changed txn actions to the dep list for the updateShown-useEffect
// This is to ensure the txnArray list show to the user is updated whenever a new txn is picked up

const RecentTxns = () => {
  const { t } = useTranslation()
  const wallet = useWeb3React()

  const dao = useDao()
  const pool = usePool()
  const router = useRouter()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()

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
        filtered = filtered.filter((txn) => txn.chainId === network.chainId)
      }
      setTxnArray(filtered)
    } else {
      setTxnArray([])
    }
  }
  useEffect(() => {
    updateFiltered()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    active,
    wallet.account,
    dao.txn,
    dao.propTxn,
    pool.txn,
    router.txn,
    sparta.txn,
    synth.txn,
    web3.txn,
  ]) // add in any other txn-related deps here

  const updateShown = () => {
    let amountOfPages = 0
    if (txnArray?.length > 0 && wallet.account) {
      setShownArray(
        txnArray.slice((active - 1) * txnsPerPage, active * txnsPerPage),
      )
      amountOfPages = Math.ceil(txnArray.length / txnsPerPage)
      createPagination(amountOfPages)
    } else {
      setShownArray([])
    }
  }
  useEffect(() => {
    updateShown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnArray, active])

  const onClear = () => {
    clearTxns(wallet.account)
    setActive(1)
    updateFiltered()
    updateShown()
  }

  const getFrom = (txn) => {
    let sendAmnt = txn.sendAmnt1 ? formatFromWei(txn.sendAmnt1) : ''
    let sendAddr = txn.send1
      ? txn.send1.length > 15
        ? txn.send1 === wallet.account
          ? 'Your Wallet'
          : formatShortString(txn.send1)
        : txn.send1
      : ''
    const send1 = `${sendAmnt} ${sendAmnt && sendAddr && 'from'} ${sendAddr}`
    let send2 = ''
    if (txn.send2) {
      sendAmnt = txn.sendAmnt2 ? formatFromWei(txn.sendAmnt2) : ''
      sendAddr = txn.send2
        ? txn.send2.length > 15
          ? txn.send2 === wallet.account
            ? 'Your Wallet'
            : formatShortString(txn.send2)
          : txn.send2
        : ''
      send2 = `${sendAmnt} ${sendAmnt && sendAddr && 'from'} ${sendAddr}`
    }
    return [send1, send2]
  }

  const getTo = (txn) => {
    let recAmnt = txn.recAmnt1 ? formatFromWei(txn.recAmnt1) : ''
    let recAddr = txn.rec1
      ? txn.rec1.length > 15
        ? txn.rec1 === wallet.account
          ? 'Your Wallet'
          : formatShortString(txn.rec1)
        : txn.rec1
      : ''
    const rec1 = `${recAmnt} ${recAmnt && recAddr && 'to'} ${recAddr}`
    let rec2 = ''
    if (txn.rec2) {
      recAmnt = txn.recAmnt2 ? formatFromWei(txn.recAmnt2) : ''
      recAddr = txn.rec2
        ? txn.rec2.length > 15
          ? txn.rec2 === wallet.account
            ? 'Your Wallet'
            : formatShortString(txn.rec2)
          : txn.rec2
        : ''
      rec2 = `${recAmnt} ${recAmnt && recAddr && 'to'} ${recAddr}`
    }
    return [rec1, rec2]
  }

  const _getToken = (address) => {
    const pools = pool.tokenDetails
    if (getToken(address, pools)) {
      return [getToken(address, pools), 'token']
    }
    if (getPool(address, pool.poolDetails)) {
      return [
        getToken(getPool(address, pool.poolDetails).tokenAddress, pools),
        'pool',
      ]
    }
    if (getSynth(address, synth.synthDetails)) {
      return [
        getToken(getSynth(address, synth.synthDetails).tokenAddress, pools),
        'synth',
      ]
    }
    return false
  }

  const getBadge = (address) => {
    if (_getToken(address)[1] === 'pool') {
      return (
        <img
          height="12px"
          src={spartaLpIcon}
          alt="token badge"
          className="token-badge-recent-txns"
        />
      )
    }
    if (_getToken(address)[1] === 'synth') {
      return (
        <img
          height="12px"
          src={spartaSynthIcon}
          alt="token badge"
          className="token-badge-recent-txns"
        />
      )
    }
    return ''
  }

  const isLoading = () => {
    if (
      !pool.tokenDetails ||
      !pool.poolDetails ||
      !dao.daoDetails ||
      !synth.synthDetails
    ) {
      return true
    }
    return false
  }

  return (
    <>
      <Row>
        {pool.poolDetails.length > 1 && (
          <>
            {!isLoading() ? (
              <Table borderless striped className="m-3">
                <tbody className="align-middle">
                  {shownArray?.length > 0 &&
                    wallet.account &&
                    shownArray?.map((txn) => (
                      <tr
                        key={txn.txnHash + txn.txnIndex}
                        className="text-center output-card"
                      >
                        <td>{txn.txnType}</td>
                        <td className="d-none d-sm-table-cell">
                          {txn.sendToken1 && (
                            <div className="d-inline position-relative">
                              <img
                                height="20px"
                                src={_getToken(txn.sendToken1)[0]?.symbolUrl}
                                alt="token icon"
                                className="mb-1 me-2"
                              />
                              {getBadge(txn.sendToken1)}
                            </div>
                          )}
                          {getFrom(txn)[0]}
                          <br />
                          {txn.sendToken2 && (
                            <div className="d-inline position-relative">
                              <img
                                height="20px"
                                src={_getToken(txn.sendToken2)[0]?.symbolUrl}
                                alt="token icon"
                                className="mb-1 me-2"
                              />
                              {getBadge(txn.sendToken2)}
                            </div>
                          )}
                          {getFrom(txn)[1]}
                        </td>
                        <td className="d-none d-sm-table-cell">
                          {txn.recToken1 && (
                            <div className="d-inline position-relative">
                              <img
                                height="20px"
                                src={_getToken(txn.recToken1)[0]?.symbolUrl}
                                alt="token icon"
                                className="mb-1 me-2"
                              />
                              {getBadge(txn.recToken1)}
                            </div>
                          )}
                          {getTo(txn)[0]}
                          <br />
                          {txn.recToken2 && (
                            <div className="d-inline position-relative">
                              <img
                                height="20px"
                                src={_getToken(txn.recToken2)[0]?.symbolUrl}
                                alt="token icon"
                                className="mb-1 me-2"
                              />
                              {getBadge(txn.recToken2)}
                            </div>
                          )}
                          {getTo(txn)[1]}
                        </td>
                        <td>
                          <a
                            href={getExplorerTxn(txn.txnHash)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {formatShortString(txn.txnHash)}
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <HelmetLoading height={200} width={200} />
            )}
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
                onClick={() => onClear()}
              >
                {t('clearTxns')}
              </Button>
            </div>
          </>
        )}
      </Row>
    </>
  )
}

export default RecentTxns
