import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  MDBCol,
  MDBRow,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
} from 'mdb-react-ui-kit'
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
  const [activeTab, setActiveTab] = useState('overview')

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
        <MDBRow className="row-480">
          <MDBCol size="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('home')}</h2>
              <NewPool />
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
                      active={activeTab === 'overview'}
                      onClick={() => {
                        setActiveTab('overview')
                      }}
                    >
                      {t('overview')}
                    </MDBTabsLink>
                  </MDBTabsItem>
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
                </MDBTabs>
              </MDBCol>

              {activeTab === 'overview' &&
                pool?.poolDetails
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
              {pool.poolDetails.length <= 0 && (
                <MDBCol className="card-480">
                  <HelmetLoading height={300} width={300} />
                </MDBCol>
              )}
            </MDBRow>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
