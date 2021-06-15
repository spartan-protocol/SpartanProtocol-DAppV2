import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MDBCol,
  MDBRow,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
} from 'mdb-react-ui-kit'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import LiqBond from './LiqBond'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SharePool from '../../../components/Share/SharePool'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import NewPool from '../Home/NewPool'

const Overview = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const pool = usePool()
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

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <MDBRow className="row-480">
          <MDBCol xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('liquidity')}</h2>
              <NewPool />
              {pool.poolDetails.length > 0 && <SharePool />}
            </div>
          </MDBCol>
        </MDBRow>
        {network.chainId === 97 && (
          <>
            <MDBRow className="row-480">
              <MDBCol size="12">
                <MDBTabs className="nav-tabs-custom card-480 mb-3">
                  <MDBTabsItem>
                    <MDBTabsLink
                      active={activeTab === '1'}
                      onClick={() => {
                        toggle('1')
                      }}
                    >
                      <span className="">{t('add')}</span>
                    </MDBTabsLink>
                  </MDBTabsItem>
                  <MDBTabsItem>
                    <MDBTabsLink
                      active={activeTab === '2'}
                      onClick={() => {
                        toggle('2')
                      }}
                    >
                      <span className="">{t('remove')}</span>
                    </MDBTabsLink>
                  </MDBTabsItem>
                  <MDBTabsItem>
                    <MDBTabsLink
                      active={activeTab === '4'}
                      onClick={() => {
                        toggle('4')
                      }}
                    >
                      <span className="">{t('bond')}</span>
                    </MDBTabsLink>
                  </MDBTabsItem>
                </MDBTabs>
              </MDBCol>
            </MDBRow>
            <MDBRow className="row-480">
              {pool.poolDetails.length > 0 && (
                <>
                  {activeTab === '1' && <LiqAdd />}
                  {activeTab === '2' && <LiqRemove />}
                  {activeTab === '4' && <LiqBond />}
                </>
              )}
              <MDBCol className="card-480">
                {pool.poolDetails.length <= 0 && <HelmetLoading />}
              </MDBCol>
            </MDBRow>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
