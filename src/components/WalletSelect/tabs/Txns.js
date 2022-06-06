import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import { useTranslation } from 'react-i18next'
import { getExplorerTxn } from '../../../utils/extCalls'
import { clearTxns, formatShortString } from '../../../utils/web3'
import { useDao } from '../../../store/dao'
import { usePool } from '../../../store/pool'
import { useSparta } from '../../../store/sparta'
import { useSynth } from '../../../store/synth'
import { useRouter } from '../../../store/router'
import { useWeb3 } from '../../../store/web3'
import { formatFromWei } from '../../../utils/bigNumber'
import { getPool, getSynth, getToken } from '../../../utils/math/utils'
import spartaLpIcon from '../../../assets/tokens/sparta-lp.svg'
import spartaSynthIcon from '../../../assets/tokens/sparta-synth.svg'
import HelmetLoading from '../../Spinner/index'
import txnTypes from '../txnTypes'
import { Icon } from '../../Icons/index'

const Txns = () => {
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const dao = useDao()
  const pool = usePool()
  const router = useRouter()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()

  const [txnArray, setTxnArray] = useState([])
  const [shownArray, setShownArray] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [txnsPerPage, setTxnsPerPage] = useState(6)
  const [showTxns, setShowTxns] = useState(false)
  const [show, setshow] = useState(false)

  useEffect(() => {
    const drawerHeight = document.body.offsetHeight / 3
    const rows = Math.floor(drawerHeight / 55)
    setTxnsPerPage(rows)
  }, [])

  const handleOnClick = (elem) => {
    setActivePage(elem)
  }
  const [items, setItems] = useState([])

  const createPagination = (len) => {
    let newItem
    let auxItems = []
    for (let number = 1; number <= len; number++) {
      newItem = (
        <Pagination.Item
          key={number}
          active={number === activePage}
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
        setShowTxns(true)
      } else {
        setShowTxns(false)
      }
      setTxnArray(filtered)
    } else {
      setTxnArray([])
      setShowTxns(false)
    }
  }
  useEffect(() => {
    updateFiltered()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activePage,
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
        txnArray.slice(
          (activePage - 1) * txnsPerPage,
          activePage * txnsPerPage,
        ),
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
  }, [txnArray, activePage])

  const onClear = () => {
    clearTxns(wallet.account)
    setActivePage(1)
    updateFiltered()
    updateShown()
  }

  const getType = (txn) => txnTypes.filter((x) => x.id === txn.txnType)[0]

  const getFrom = (txn) => {
    // const type = getType(txn)
    let sendAmnt = txn.sendAmnt1 ? formatFromWei(txn.sendAmnt1) : ''
    let sendAddr = txn.send1
      ? txn.send1.length > 15
        ? txn.send1 === wallet.account
          ? 'Your Wallet'
          : formatShortString(txn.send1)
        : txn.send1
      : ''
    const send1 = (
      <span>
        {sendAmnt}
        <br /> {sendAmnt && sendAddr && 'From:'} {sendAddr}
      </span>
    )
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
      send2 = (
        <span>
          {sendAmnt}
          <br />
          {sendAmnt && sendAddr && 'From:'} {sendAddr}
        </span>
      )
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
    const rec1 = (
      <span>
        {recAmnt}
        <br />
        {recAmnt && recAddr && 'To:'} {recAddr}
      </span>
    )
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
      rec2 = (
        <span>
          {recAmnt}
          <br />
          {recAmnt && recAddr && 'To:'} {recAddr}
        </span>
      )
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
          className="token-badge-tighter"
        />
      )
    }
    if (_getToken(address)[1] === 'synth') {
      return (
        <img
          height="12px"
          src={spartaSynthIcon}
          alt="token badge"
          className="token-badge-tighter"
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
      {showTxns ? (
        <>
          <Badge className="mb-3">{t('recentTxns')}</Badge>
          <Row className="output-card text-center">
            {pool.poolDetails.length > 1 && (
              <>
                <Col xs="12">
                  {!isLoading() ? (
                    <Table borderless striped>
                      <tbody className="align-middle">
                        {shownArray?.length > 0 &&
                          wallet.account &&
                          shownArray?.map((txn) => (
                            <tr
                              key={txn.txnHash + txn.txnIndex}
                              className="text-center"
                            >
                              <td>{getType(txn).title}</td>
                              <td className="d-none d-sm-table-cell">
                                {txn.sendToken1 && (
                                  <div className="d-inline position-relative">
                                    <img
                                      height="20px"
                                      src={
                                        _getToken(txn.sendToken1)[0]?.symbolUrl
                                      }
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
                                      src={
                                        _getToken(txn.sendToken2)[0]?.symbolUrl
                                      }
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
                                      src={
                                        _getToken(txn.recToken1)[0]?.symbolUrl
                                      }
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
                                      src={
                                        _getToken(txn.recToken2)[0]?.symbolUrl
                                      }
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
                    <HelmetLoading height={100} width={100} />
                  )}
                </Col>
                <Col xs="12">
                  <Pagination className="d-inline-flex mb-0">
                    <Pagination.First
                      disabled={activePage === 1}
                      onClick={() => handleOnClick(1)}
                    />
                    <Pagination.Prev
                      disabled={activePage === 1}
                      onClick={() =>
                        activePage > 1 && handleOnClick(activePage - 1)
                      }
                    />
                    {items[activePage - 1]}
                    {items[activePage]}
                    <Pagination.Next
                      disabled={activePage === items.length}
                      onClick={() => handleOnClick(activePage + 1)}
                    />
                    <Pagination.Last
                      disabled={activePage === items.length}
                      onClick={() => handleOnClick(items.length)}
                    />
                  </Pagination>
                  <Button className="ms-1" onClick={() => setshow(!show)}>
                    <Icon icon="trash" size="20" />
                  </Button>
                  <Alert show={show} variant="" className="mt-2">
                    <Alert.Heading>Clear History?</Alert.Heading>
                    <p>
                      Your wallet transaction history is stored in your browser
                      localStorage on your device. Would you like to clear the
                      transaction history for this wallet now?
                    </p>
                    <hr />
                    <div className="text-center">
                      <Button onClick={() => setshow(false)} className="me-2">
                        No, Cancel!
                      </Button>
                      <Button onClick={() => onClear()}>Yes, Clear!</Button>
                    </div>
                  </Alert>
                </Col>
              </>
            )}
          </Row>
        </>
      ) : (
        `Only transactions from this device & browser are shown`
      )}
    </>
  )
}

export default Txns
