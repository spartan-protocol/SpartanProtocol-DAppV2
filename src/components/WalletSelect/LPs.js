import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { watchAsset, useWeb3 } from '../../store/web3'
import { BN, convertFromWei, formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/icons'
import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'
import { getPool, getToken } from '../../utils/math/utils'
import { useDao } from '../../store/dao'
import { useBond } from '../../store/bond'
import { calcLiqValueInBase } from '../../utils/math/nonContract'
import HelmetLoading from '../Loaders/HelmetLoading'

const LPs = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()

  const _getToken = (tokenAddress) => getToken(tokenAddress, pool.tokenDetails)

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
    const token = _getToken(asset.tokenAddress)
    if (walletType === 'MM') {
      dispatch(
        watchAsset(
          asset.address,
          `${token?.symbol.substring(0, 10)}p`,
          '18',
          token?.symbolUrl,
          wallet,
        ),
      )
    }
  }

  /** @returns {object} poolDetails item */
  const _getPool = (tokenAddr) => getPool(tokenAddr, pool.poolDetails)

  /** @returns BN(usdValue) */
  const getUSD = (tokenAddr, amount) => {
    if (pool.poolDetails.length > 1) {
      if (_getPool) {
        return calcLiqValueInBase(amount, _getPool(tokenAddr)).times(
          web3.spartaPrice,
        )
      }
    }
    return '0.00'
  }

  const isLoading = () => {
    if (!pool.poolDetails || !dao.daoDetails || !bond.bondDetails) {
      return true
    }
    return false
  }
  /* eslint no-return-assign: "error" */

  const getTotalValue = () => {
    let total = BN(0)
    pool.poolDetails
      ?.filter((asset) => asset.balance > 0)
      .forEach(
        (asset) =>
          (total = total.plus(getUSD(asset.tokenAddress, asset.balance))),
      )

    bond.bondDetails
      ?.filter((asset) => asset.staked > 0)
      .forEach(
        (asset) =>
          (total = total.plus(getUSD(asset.tokenAddress, asset.staked))),
      )

    dao.daoDetails
      ?.filter((asset) => asset.staked > 0)
      .forEach(
        (asset) =>
          (total = total.plus(getUSD(asset.tokenAddress, asset.staked))),
      )

    if (!total.isZero()) {
      return (
        <>
          <hr />
          <Row key="total-assets" className="mb-3 output-card">
            <Col xs="auto" className="pe-1">
              {' '}
              <img width="35px" alt="empty" className="invisible" />
            </Col>
            <Col className="align-items-center">
              <Row>
                <Col xs="auto">Total</Col>
                <Col className="hide-i5">
                  <div className="text-end mt-2">
                    ~$ {formatFromWei(total, 0)}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs="auto" className="text-right">
              <Row>
                <Col xs="6" className="mt-1">
                  <Icon className="invisible" size="24" />
                </Col>
                <Col xs="6" className="mt-1">
                  <Icon className="invisible" size="24" />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )
    }
    return ''
  }

  return (
    <>
      {/* HELD LP TOKENS */}
      {console.log(1)}
      {!isLoading() &&
        pool.poolDetails
          ?.filter((asset) => asset.balance > 0)
          .sort(
            (a, b) =>
              convertFromWei(getUSD(b.tokenAddress, b.balance)) -
              convertFromWei(getUSD(a.tokenAddress, a.balance)),
          )
          .map((asset) => (
            <Row key={`${asset.address}-lp`} className="mb-3 output-card">
              <Col xs="auto" className="position-relative pe-1">
                <img
                  height="35px"
                  src={_getToken(asset.tokenAddress)?.symbolUrl}
                  alt={_getToken(asset.tokenAddress)?.name}
                />
                <img
                  src={spartaLpIcon}
                  height="20px"
                  className="token-badge"
                  alt={`${_getToken(asset.tokenAddress)?.symbol} LP token icon`}
                />
              </Col>
              <Col className="align-items-center">
                <Row>
                  <Col xs="auto">
                    {`${_getToken(asset.tokenAddress)?.symbol}p - ${t(
                      'wallet',
                    )}`}
                    <div className="description">
                      {formatFromWei(asset.balance)}
                    </div>
                  </Col>
                  <Col className="hide-i5">
                    <div className="text-end mt-2">
                      ~$
                      {formatFromWei(
                        getUSD(asset.tokenAddress, asset.balance),
                        0,
                      )}
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
      {/* STAKED LP TOKENS */}
      {!isLoading() &&
        dao.daoDetails?.filter((asset) => asset.staked > 0).length > 0 && (
          <hr />
        )}
      {!isLoading() &&
        dao.daoDetails
          ?.filter((asset) => asset.staked > 0)
          .sort(
            (a, b) =>
              convertFromWei(getUSD(b.tokenAddress, b.balance)) -
              convertFromWei(getUSD(a.tokenAddress, a.balance)),
          )
          .map((asset) => (
            <Row key={`${asset.address}-lpdao`} className="mb-3 output-card">
              <Col xs="auto" className="position-relative pe-1">
                <img
                  height="35px"
                  src={_getToken(asset.tokenAddress)?.symbolUrl}
                  alt={_getToken(asset.tokenAddress)?.name}
                />
                <img
                  src={spartaLpIcon}
                  height="20px"
                  className="token-badge"
                  alt={`${_getToken(asset.tokenAddress)?.symbol} LP token icon`}
                />
              </Col>
              <Col className="align-items-center">
                <Row>
                  <Col xs="auto">
                    {`${_getToken(asset.tokenAddress)?.symbol}p - ${t(
                      'staked',
                    )}`}
                    <div className="description">
                      {formatFromWei(asset.staked)}
                    </div>
                  </Col>
                  <Col className="hide-i5">
                    <div className="text-end mt-2">
                      ~$
                      {formatFromWei(
                        getUSD(asset.tokenAddress, asset.staked),
                        0,
                      )}
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
      {/* BONDED LP TOKENS */}
      {!isLoading() &&
        bond.bondDetails?.filter((asset) => asset.staked > 0).length > 0 && (
          <hr />
        )}
      {!isLoading() &&
        bond.bondDetails
          ?.filter((asset) => asset.staked > 0)
          .sort(
            (a, b) =>
              convertFromWei(getUSD(b.tokenAddress, b.balance)) -
              convertFromWei(getUSD(a.tokenAddress, a.balance)),
          )
          .map((asset) => (
            <Row key={`${asset.address}-lpbond`} className="mb-3 output-card">
              <Col xs="auto" className="position-relative pe-1">
                <img
                  height="35px"
                  src={_getToken(asset.tokenAddress)?.symbolUrl}
                  alt={_getToken(asset.tokenAddress)?.name}
                />
                <img
                  src={spartaLpIcon}
                  height="20px"
                  className="token-badge"
                  alt={`${_getToken(asset.tokenAddress)?.symbol} LP token icon`}
                />
              </Col>
              <Col className="align-items-center">
                <Row>
                  <Col xs="auto">
                    {`${_getToken(asset.tokenAddress)?.symbol}p - ${t('bond')}`}
                    <div className="description">
                      {formatFromWei(asset.staked)}
                    </div>
                  </Col>
                  <Col className="hide-i5">
                    <div className="text-end mt-2">
                      ~$
                      {formatFromWei(
                        getUSD(asset.tokenAddress, asset.staked),
                        0,
                      )}
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
      {getTotalValue()}
      {isLoading() && (
        <Col className="card-480">
          <HelmetLoading height={300} width={300} />
        </Col>
      )}
    </>
  )
}

export default LPs
