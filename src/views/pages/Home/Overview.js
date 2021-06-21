import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import PoolItem from './PoolItem'
import { usePool } from '../../../store/pool'
import { getAddresses, getNetwork } from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { allListedAssets } from '../../../store/bond/actions'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import NewPool from './NewPool'

const Overview = () => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const { t } = useTranslation()
  const pool = usePool()
  const addr = getAddresses()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const [trigger1, settrigger1] = useState(0)
  useEffect(() => {
    if (trigger1 === 0 && network.chainId === 97) {
      dispatch(allListedAssets(wallet))
    }
    const timer = setTimeout(() => {
      if (network.chainId === 97) {
        dispatch(allListedAssets(wallet))
        settrigger1(trigger1 + 1)
      }
    }, 10000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 me-3">{t('home')}</h2>
              <NewPool />
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <Tabs className="card-480 mb-3">
                  <Tab eventKey="overview" title={t('overview')}>
                    <Row>
                      {pool?.poolDetails
                        .filter(
                          (asset) =>
                            asset.tokenAddress !== addr.spartav1 &&
                            asset.tokenAddress !== addr.spartav2 &&
                            asset.baseAmount > 0,
                        )
                        .sort((a, b) => b.baseAmount - a.baseAmount)
                        .map((asset) => (
                          <PoolItem key={asset.address} asset={asset} />
                        ))}
                    </Row>
                  </Tab>
                  {/* <MDBTabsItem>
                    <MDBTabsLink
                      active={activeTab === 'positions'}
                      onClick={() => {
                        setActiveTab('positions')
                      }}
                    >
                      {t('positions')}
                    </MDBTabsLink>
                  </MDBTabsItem> */}
                </Tabs>
              </Col>

              {pool.poolDetails.length <= 0 && (
                <Col className="card-480">
                  <HelmetLoading height={300} width={300} />
                </Col>
              )}
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
