import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { useWeb3, watchAsset } from '../../store/web3'
import { BN, convertFromWei, formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/icons'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'
import { getAddresses } from '../../utils/web3'

const Assets = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const addr = getAddresses()

  const getWalletType = () => {
    if (window.ethereum?.isMetaMask) {
      return 'MM'
    }
    if (window.ethereum?.isTrust) {
      return 'TW'
    }
    return false
  }

  const handleWatchAsset = (asset) => {
    const walletType = getWalletType()
    if (walletType === 'MM') {
      dispatch(
        watchAsset(
          asset.address,
          asset.symbol.substring(0, 11),
          '18',
          asset.symbolUrl,
          wallet,
        ),
      )
    }
  }

  /** @returns {object} poolDetails item */
  const _getPool = (tokenAddr) => {
    const _pool = getPool(tokenAddr, pool.poolDetails)
    if (_pool !== '') {
      return _pool
    }
    return false
  }

  /** @returns {boolean} isSparta */
  const isSparta = (tokenAddr) => {
    if (tokenAddr === addr.spartav1 || tokenAddr === addr.spartav2) {
      return true
    }
    return false
  }

  /** @returns BN(usdValue) */
  const getUSD = (tokenAddr, amount) => {
    if (pool.poolDetails.length > 1) {
      if (isSparta(tokenAddr)) {
        return BN(amount).times(web3.spartaPrice)
      }
      if (_getPool) {
        return calcSpotValueInBase(amount, _getPool(tokenAddr)).times(
          web3.spartaPrice,
        )
      }
    }
    return '0.00'
  }

  return (
    <>
      {pool.tokenDetails
        ?.filter((asset) => asset.balance > 0)
        .sort(
          (a, b) =>
            convertFromWei(getUSD(b.address, b.balance)) -
            convertFromWei(getUSD(a.address, a.balance)),
        )
        .map((asset) => (
          <Row key={`${asset.address}-asset`} className="mb-3 output-card">
            <Col xs="auto" className="pe-1">
              <img
                height="35px"
                src={asset.symbolUrl}
                alt={asset.name}
                className=""
              />
            </Col>
            <Col className="align-items-center">
              <Row>
                <Col xs="auto">
                  {asset.symbol} - {t('wallet')}
                  <div className="description">
                    {formatFromWei(asset.balance)}
                  </div>
                </Col>
                <Col className="hide-i5">
                  <div className="text-end mt-2">
                    ~${formatFromWei(getUSD(asset.address, asset.balance), 0)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="auto" className="text-right">
              <Row>
                <Col xs="6" className="mt-1">
                  <ShareLink url={asset.address}>
                    <Icon icon="copy" role="button" size="24" />
                  </ShareLink>
                </Col>
                {getWalletType() && (
                  <Col xs="6" className="mt-1">
                    <a
                      href={
                        getWalletType() === 'TW'
                          ? `trust://add_asset?asset=c20000714_t${asset.address}`
                          : '#section'
                      }
                    >
                      <div
                        role="button"
                        aria-hidden="true"
                        onClick={() => {
                          handleWatchAsset(asset)
                        }}
                      >
                        {getWalletType() === 'MM' ? (
                          <Icon icon="metamask" role="button" size="24" />
                        ) : (
                          <Icon icon="trustwallet" role="button" size="24" />
                        )}
                      </div>
                    </a>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        ))}
    </>
  )
}

export default Assets
