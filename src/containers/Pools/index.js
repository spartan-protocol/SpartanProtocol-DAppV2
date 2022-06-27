import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import PoolItem from './PoolItem'
import PoolTable from './PoolTable'
import SynthTable from './SynthTable'
import { usePool } from '../../store/pool'
import { tempChains } from '../../utils/web3'
import { convertToWei, BN } from '../../utils/bigNumber'
import HelmetLoading from '../../components/Spinner/index'
import { useBond, bondVaultWeight } from '../../store/bond'
import WrongNetwork from '../../components/WrongNetwork/index'
import SummaryItem from './SummaryItem'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { useWeb3 } from '../../store/web3'
import { calcDaoAPY, calcSynthAPY } from '../../utils/math/nonContract'
import { useDao, daoVaultWeight } from '../../store/dao'
import SynthItem from './SynthItem'
import { synthVaultWeight, useSynth } from '../../store/synth'
import NewPool from './NewPool'
import { useApp } from '../../store/app'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const app = useApp()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const synth = useSynth()
  const web3 = useWeb3()

  const [activeTab, setActiveTab] = useState('pools')
  const [daoApy, setDaoApy] = useState('0')
  const [synthApy, setSynthApy] = useState('0')
  const [showModal, setShowModal] = useState(false)
  const [tableView, setTableView] = useState(true)

  useEffect(() => {
    if (activeTab !== 'synths') {
      dispatch(daoVaultWeight())
      dispatch(bondVaultWeight())
    }
  }, [activeTab, dispatch, pool.poolDetails])

  useEffect(() => {
    if (activeTab === 'synths') {
      dispatch(synthVaultWeight())
    }
  }, [activeTab, dispatch, pool.poolDetails])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  const getPools = () =>
    !isLoading() &&
    pool.poolDetails
      .filter(
        (asset) =>
          BN(asset.baseAmount).isGreaterThanOrEqualTo(convertToWei('10000')) &&
          !asset.newPool,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getNewPools = () =>
    !isLoading() &&
    pool.poolDetails
      .filter((asset) => asset.baseAmount > 0 && asset.newPool === true)
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getBabies = () =>
    !isLoading() &&
    pool.poolDetails
      .filter(
        (asset) =>
          asset.baseAmount > 0 &&
          BN(asset.baseAmount).isLessThan(convertToWei('10000')) &&
          !asset.newPool,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getSynths = () =>
    !isLoading() &&
    pool.poolDetails
      .filter(
        (asset) =>
          BN(asset.baseAmount).isGreaterThanOrEqualTo(convertToWei('10000')) &&
          !asset.newPool &&
          asset.curated,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  useEffect(() => {
    const getTotalDaoWeight = () => {
      const _amount = BN(bond.totalWeight).plus(dao.totalWeight)
      if (_amount > 0) {
        return _amount
      }
      return '0.00'
    }
    const getDaoApy = () => {
      let revenue = BN(web3.metrics.global[0].daoVault30Day)
      revenue = revenue.toString()
      const baseAmount = getTotalDaoWeight().toString()
      const apy = calcDaoAPY(revenue, baseAmount)
      return apy.toFixed(2).toString()
    }
    if (web3.metrics.global && bond.totalWeight && dao.totalWeight) {
      setDaoApy(getDaoApy())
    }
  }, [web3.metrics.global, bond.totalWeight, dao.totalWeight])

  useEffect(() => {
    const getSynthApy = () => {
      let revenue = BN(web3.metrics.global[0].synthVault30Day)
      revenue = revenue.toString()
      const baseAmount = synth.totalWeight.toString()
      const apy = calcSynthAPY(revenue, baseAmount)
      return apy.toFixed(2).toString()
    }
    if (synth.totalWeight && web3.metrics.global) {
      setSynthApy(getSynthApy())
    }
  }, [web3.metrics.global, synth.totalWeight])

  const renderPools = () => {
    if (tableView) {
      return <PoolTable poolItems={getPools()} daoApy={daoApy} />
    }
    return getPools().map((asset) => (
      <PoolItem key={asset.address} asset={asset} daoApy={daoApy} />
    ))
  }

  const renderNewPools = () => {
    if (getNewPools().length > 0) {
      if (tableView) {
        return (
          <>
            <PoolTable poolItems={getNewPools()} daoApy={daoApy} />
          </>
        )
      }
      return (
        <>
          {getNewPools().map((asset) => (
            <PoolItem key={asset.address} asset={asset} daoApy={daoApy} />
          ))}
        </>
      )
    }
    return (
      <>
        <Col>There are no new/initializing pools</Col>
      </>
    )
  }

  const renderBabies = () => {
    if (getBabies().length > 0) {
      if (tableView) {
        return (
          <>
            <PoolTable poolItems={getBabies()} daoApy={daoApy} />
          </>
        )
      }
      return (
        <>
          {getBabies().map((asset) => (
            <PoolItem key={asset.address} asset={asset} daoApy={daoApy} />
          ))}
        </>
      )
    }
    return (
      <>
        <Col>There are no pools below the minimum liquidity threshold</Col>
      </>
    )
  }

  const renderSynths = () => {
    if (synth.synthDetails) {
      if (tableView) {
        return (
          <>
            <SynthTable synthItems={getSynths()} synthApy={synthApy} />
          </>
        )
      }
      return (
        <>
          {getSynths().map((asset) => (
            <SynthItem key={asset.address} asset={asset} synthApy={synthApy} />
          ))}
        </>
      )
    }
    return null
  }

  return (
    <>
      {tempChains.includes(app.chainId) && (
        <>
          <Row>
            <SummaryItem />
            {/* MOBILE FILTER DROPDOWN -> CHANGE THIS TO NAV-DROPDOWN? */}
            <Col className="d-flex d-sm-none mt-3 mb-1">
              <Form.Select onChange={(e) => setActiveTab(e.target.value)}>
                <option value="pools">
                  {t('pools')} ({getPools().length})
                </option>
                {getNewPools().length > 0 && (
                  <option value="new">
                    {t('new')} ({getNewPools().length})
                  </option>
                )}
                <option value="babies">
                  {t('< 10K')} ({getBabies().length})
                </option>
                <option value="synths">
                  {t('synths')} ({getSynths().length})
                </option>
              </Form.Select>
            </Col>
            {/* DESKTOP FILTER NAV ITEMS */}
            <Col className="d-none d-sm-flex mt-3 mb-1">
              <Nav
                variant="pills"
                activeKey={activeTab}
                onSelect={(e) => setActiveTab(e)}
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="pools"
                    className="btn-sm btn-outline-primary"
                  >
                    {t('pools')}
                    <Badge bg="secondary" className="ms-2">
                      {!isLoading() ? (
                        getPools().length
                      ) : (
                        <Icon icon="cycle" size="15" className="anim-spin" />
                      )}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                {getNewPools().length > 0 && (
                  <Nav.Item>
                    <Nav.Link bg="secondary" eventKey="new" className="btn-sm">
                      {t('new')}
                      <Badge bg="secondary" className="ms-2">
                        {!isLoading() ? (
                          getNewPools().length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <Nav.Link eventKey="babies" className="btn-sm">
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'hiddenPools')}
                    >
                      <span role="button">
                        <Icon icon="info" className="me-1" size="15" />
                      </span>
                    </OverlayTrigger>
                    {t('< 10K')}
                    <Badge bg="secondary" className="ms-2">
                      {!isLoading() ? (
                        getBabies().length
                      ) : (
                        <Icon icon="cycle" size="15" className="anim-spin" />
                      )}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="synths" className="btn-sm">
                    {t('synths')}
                    <Badge bg="secondary" className="ms-2">
                      {!isLoading() ? (
                        getSynths().length
                      ) : (
                        <Icon icon="cycle" size="15" className="anim-spin" />
                      )}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col xs="auto" className="mt-3 mb-1 text-end">
              <Button onClick={() => setTableView(!tableView)} className="me-1">
                <Icon
                  icon={tableView ? 'grid' : 'table'}
                  size="13"
                  className="me-1 mb-1"
                />
                {t('view')}
              </Button>
              <Button onClick={() => setShowModal(!showModal)}>
                <Icon icon="plus" size="12" className="me-1 mb-1" />
                {t('createPool')}
              </Button>
            </Col>
          </Row>

          {/* CREATE-POOL MODAL */}
          {showModal && (
            <NewPool setShowModal={setShowModal} showModal={showModal} />
          )}

          {/* POOL ITEMS */}
          {!isLoading() ? (
            <Row className={`${tableView && ''}`}>
              {activeTab === 'pools' && renderPools()}
              {activeTab === 'new' && renderNewPools()}
              {activeTab === 'babies' && renderBabies()}
              {activeTab === 'synths' && renderSynths()}
            </Row>
          ) : (
            <HelmetLoading height={150} width={150} />
          )}
        </>
      )}
      {!tempChains.includes(app.chainId) && <WrongNetwork />}
    </>
  )
}

export default Overview
