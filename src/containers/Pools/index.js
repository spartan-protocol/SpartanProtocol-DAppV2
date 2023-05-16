import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import PoolTableHeader from './PoolTableHeader'
import PoolItem from './PoolItem'
import { usePool } from '../../store/pool'
import { getSynthTokens, tempChains } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import HelmetLoading from '../../components/Spinner/index'
import { useBond } from '../../store/bond'
import WrongNetwork from '../../components/WrongNetwork/index'
import SummaryItem from './SummaryItem'
import { Icon } from '../../components/Icons/index'
import { useWeb3 } from '../../store/web3'
import { calcAPY, calcDaoAPY } from '../../utils/math/nonContract'
import { useDao } from '../../store/dao'
import SynthItem from './SynthItem'
// import { synthVaultWeight } from '../../store/synth'
import NewPool from './NewPool'
import { useApp } from '../../store/app'
import styles from './styles.module.scss'
import PoolTableItem from './PoolTableItem'
import { getToken } from '../../utils/math/utils'
import SynthTableHeader from './SynthTableHeader'
import SynthTableItem from './SynthTableItem'

const Overview = () => {
  const { t } = useTranslation()

  const app = useApp()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  // const synth = useSynth()
  const web3 = useWeb3()

  const [activeTab, setActiveTab] = useState('pools')
  const [showModal, setShowModal] = useState(false)
  const [tableView, setTableView] = useState(true)

  const [daoApy, setDaoApy] = useState('0')
  // const [synthApy] = useState('0')
  const [arrayPools, setarrayPools] = useState(false)
  const [arrayNewPools, setarrayNewPools] = useState(false)
  const [arraySynths, setarraySynths] = useState(false)
  const [sortBy, setSortBy] = useState({ value: 'liquidity', order: 'desc' })
  const [searchQuery, setsearchQuery] = useState(false)

  const searchInput = document.getElementById('searchInput')

  // useEffect(() => {
  //   if (activeTab === 'synths') {
  //     dispatch(synthVaultWeight())
  //   }
  // }, [activeTab, dispatch, pool.poolDetails])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  // Update the pools (and newPools) array local state
  useEffect(() => {
    if (activeTab === 'pools' && pool.poolDetails.length > 0) {
      // Get initial pools array
      let tempPoolsArray = pool.poolDetails.filter(
        (asset) => asset.baseAmount > 0,
      )

      // Filter initial pools array based on search query
      if (searchQuery) {
        tempPoolsArray = tempPoolsArray.filter((asset) =>
          getToken(asset.tokenAddress, pool.tokenDetails)
            .symbol.toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      }

      // logic to sort by pool name
      const sortPool = (_tempPoolsArray) => {
        const finalArray = _tempPoolsArray.sort((a, b) => {
          const _a = getToken(a.tokenAddress, pool.tokenDetails).symbol
          const _b = getToken(b.tokenAddress, pool.tokenDetails).symbol
          const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
          if (first > second) {
            return 1
          }
          if (second > first) {
            return -1
          }
          return 0
        })
        return finalArray
      }

      // logic to sort by pool liquidity && caps
      const sortTvl = (_tempPoolsArray) => {
        const finalArray = _tempPoolsArray.sort((a, b) => {
          const _a = a.baseAmount
          const _b = b.baseAmount
          const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
          return first - second
        })
        return finalArray
      }

      // logic to sort by pool volume
      const sortVol = (_tempPoolsArray) => {
        const finalArray = _tempPoolsArray.sort((a, b) => {
          const _a = pool.incentives.filter((x) => x.address === a.address)[0]
            .volume
          const _b = pool.incentives.filter((x) => x.address === b.address)[0]
            .volume
          const [first, second] = sortBy.order === 'desc' ? [_b, _a] : [_a, _b]
          return first - second
        })
        return finalArray
      }

      // logic to sort by pool APY
      const sortApy = (_tempPoolsArray) => {
        const finalArray = _tempPoolsArray.sort((a, b) => {
          const _a = pool.incentives.filter((x) => x.address === a.address)[0]
          const _b = pool.incentives.filter((x) => x.address === b.address)[0]
          let apyA = calcAPY(a, _a.fees, _a.incentives)
          apyA = a.curated && daoApy ? BN(apyA).plus(daoApy) : apyA
          let apyB = calcAPY(b, _b.fees, _b.incentives)
          apyB = b.curated && daoApy ? BN(apyB).plus(daoApy) : apyB
          const [first, second] =
            sortBy.order === 'desc' ? [apyB, apyA] : [apyA, apyB]
          return first - second
        })
        return finalArray
      }

      // Sort the pools array by user-selected params
      if (sortBy.value === 'poolName') {
        tempPoolsArray = sortPool(tempPoolsArray)
      } else if (sortBy.value === 'volume' && pool.incentives) {
        tempPoolsArray = sortVol(tempPoolsArray)
      } else if (sortBy.value === 'apy' && pool.incentives) {
        tempPoolsArray = sortApy(tempPoolsArray)
      } else {
        tempPoolsArray = sortTvl(tempPoolsArray)
      }

      setarrayPools(tempPoolsArray.filter((x) => !x.newPool))
      setarrayNewPools(tempPoolsArray.filter((x) => x.newPool))
    }
  }, [
    searchQuery,
    pool.poolDetails,
    sortBy.order,
    sortBy.value,
    daoApy,
    pool.tokenDetails,
    pool.incentives,
    activeTab,
  ])

  // Update the synths array local state
  useEffect(() => {
    if (pool.poolDetails.length > 0) {
      setarraySynths(
        pool.poolDetails.filter((asset) =>
          getSynthTokens(app.chainId).includes(asset.tokenAddress),
        ),
      )
    }
  }, [activeTab, pool.poolDetails, app.chainId])

  // Update the dao apy local state
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

  // Update the synth apy local state
  // useEffect(() => {
  //   const getSynthApy = () => {
  //     let revenue = BN(web3.metrics.global[0].synthVault30Day)
  //     revenue = revenue.toString()
  //     const baseAmount = synth.totalWeight.toString()
  //     const apy = calcSynthAPY(revenue, baseAmount)
  //     return apy.toFixed(2).toString()
  //   }
  //   if (synth.totalWeight && web3.metrics.global) {
  //     setSynthApy(getSynthApy())
  //   }
  // }, [web3.metrics.global, synth.totalWeight])

  const sortTable = (column) => {
    let order = sortBy.order === 'desc' ? 'asc' : 'desc'
    if (sortBy.value === column) {
      setSortBy({ value: column, order })
    } else {
      order = 'desc'
      setSortBy({ value: column, order })
    }
  }

  const clearSearch = () => {
    searchInput.value = ''
    setsearchQuery('')
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
                  {t('pools')} ({arrayPools.length})
                </option>
                {arrayNewPools.length > 0 && (
                  <option value="new">
                    {t('new')} ({arrayNewPools.length})
                  </option>
                )}
                <option value="synths">
                  {t('synths')} ({arraySynths.length})
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
                        arrayPools.length
                      ) : (
                        <Icon icon="cycle" size="15" className="anim-spin" />
                      )}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                {arrayNewPools.length > 0 && (
                  <Nav.Item>
                    <Nav.Link bg="secondary" eventKey="new" className="btn-sm">
                      {t('new')}
                      <Badge bg="secondary" className="ms-2">
                        {!isLoading() ? (
                          arrayNewPools.length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <Nav.Link eventKey="synths" className="btn-sm">
                    {t('synths')}
                    <Badge bg="secondary" className="ms-2">
                      {!isLoading() ? (
                        arraySynths.length
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

          {activeTab !== 'synths' && (
            <Row className="mt-1">
              <Col xs="12" sm="4" md="3" xl="2">
                <InputGroup>
                  <FormControl
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder={`${t('searchPools')}...`}
                    type="text"
                    id="searchInput"
                    style={{ height: '25px' }}
                    onChange={(e) => setsearchQuery(e.target.value)}
                  />
                  <InputGroup.Text
                    role="button"
                    tabIndex={-1}
                    onKeyPress={() => clearSearch()}
                    onClick={() => clearSearch()}
                    className="p-1"
                  >
                    <Icon size="12" icon="close" fill="grey" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          )}

          {/* CREATE-POOL MODAL */}
          {showModal && (
            <NewPool setShowModal={setShowModal} showModal={showModal} />
          )}

          {/* POOL ITEMS */}
          {!isLoading() ? (
            <Row>
              <Table className={`${styles.poolTable} table-borderless`}>
                {['new', 'pools'].includes(activeTab) && (
                  <PoolTableHeader sortTable={sortTable} sortBy={sortBy} />
                )}
                {activeTab === 'synths' && tableView && <SynthTableHeader />}

                {tableView && (
                  <tbody>
                    {activeTab === 'pools' &&
                      arrayPools &&
                      arrayPools.map((asset) => (
                        <PoolTableItem
                          key={asset.address}
                          asset={asset}
                          daoApy={daoApy}
                        />
                      ))}

                    {activeTab === 'new' &&
                      arrayNewPools &&
                      arrayNewPools.map((asset) => (
                        <PoolTableItem
                          key={asset.address}
                          asset={asset}
                          daoApy={daoApy}
                        />
                      ))}

                    {activeTab === 'synths' &&
                      arraySynths &&
                      arraySynths.map((asset) => (
                        <SynthTableItem
                          key={asset.address}
                          asset={asset}
                          // synthApy={synthApy}
                        />
                      ))}
                  </tbody>
                )}
              </Table>

              {!tableView && (
                <>
                  {activeTab === 'pools' &&
                    (arrayPools
                      ? arrayPools.map((asset) => (
                          <PoolItem
                            key={asset.address}
                            asset={asset}
                            daoApy={daoApy}
                          />
                        ))
                      : 'No pools available')}

                  {activeTab === 'new' &&
                    (arrayNewPools
                      ? arrayNewPools.map((asset) => (
                          <PoolItem
                            key={asset.address}
                            asset={asset}
                            daoApy={daoApy}
                          />
                        ))
                      : 'No new pools available')}
                  {activeTab === 'synths' &&
                    (arraySynths
                      ? arraySynths.map((asset) => (
                          <SynthItem
                            key={asset.address}
                            asset={asset}
                            // synthApy={synthApy}
                          />
                        ))
                      : 'No synths available')}
                </>
              )}
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
