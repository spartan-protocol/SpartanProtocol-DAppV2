import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { useSparta } from '../../../store/sparta'
import { watchAsset, useWeb3 } from '../../../store/web3'
import { convertFromWei, formatFromWei } from '../../../utils/bigNumber'
import ShareLink from '../../Share/ShareLink'
import { Icon } from '../../Icons/index'
import spartaLpIcon from '../../../assets/tokens/sparta-lp.svg'
import spartaIcon from '../../../assets/tokens/spartav2.svg'
import { getPool, getToken } from '../../../utils/math/utils'
import { useDao } from '../../../store/dao'
import { useBond } from '../../../store/bond'
import { removeLiq } from '../../../utils/math/router'
import {
  calcLiqValueAll,
  calcLiqValueIn,
} from '../../../utils/math/nonContract'
import HelmetLoading from '../../Spinner/index'

const LPs = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const sparta = useSparta()

  const [showUsd, setShowUsd] = useState(false)
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  const handleChangeShow = () => {
    setShowUsd(!showUsd)
  }

  const getLPsValue = (asset, units) => {
    const [spartaOutput, tokenOutput] = removeLiq(
      units,
      getPool(asset.tokenAddress, pool.poolDetails),
      sparta.globalDetails.feeOnTransfer,
    )
    return [spartaOutput, tokenOutput]
  }

  const _getToken = (tokenAddress) => getToken(tokenAddress, pool.tokenDetails)

  const getWalletType = () => {
    const lastWallet = window.localStorage.getItem('lastWallet')
    if (['MM', 'TW', 'BRAVE'].includes(lastWallet)) {
      return lastWallet
    }
    return false
  }

  const handleWatchAsset = (asset) => {
    const walletType = getWalletType()
    const token = _getToken(asset.tokenAddress)
    if (['MM', 'BRAVE'].includes(walletType)) {
      dispatch(
        watchAsset(
          asset.address,
          `${token.symbol.substring(0, 10)}p`,
          '18',
          token.symbolUrl,
          wallet.account,
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
        return calcLiqValueIn(amount, _getPool(tokenAddr), spartaPrice)[1]
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

  const getTotalValue = () => {
    const total = calcLiqValueAll(
      pool.poolDetails,
      dao.daoDetails,
      bond.bondDetails,
      spartaPrice,
    )[1]
    if (total > 0) {
      return (
        <div className="hide-i5">
          <hr />
          <Row key="total-assets" className="output-card">
            <Col xs="auto" className="pe-1">
              {' '}
              <img width="35px" alt="empty" className="invisible" />
            </Col>

            <Col className="align-items-center">
              <Row>
                <Col xs="auto" className="float-left output-card">
                  <strong>{t('total')}</strong>
                </Col>
                <Col>
                  <div className="text-sm-label text-end">
                    {spartaPrice > 0 ? `~$${formatFromWei(total, 0)}` : ''}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              className="text-center me-1 mt-1"
              style={{ maxWidth: '75px' }}
            />
          </Row>
        </div>
      )
    }
    return ''
  }

  return (
    <>
      <Badge className="mb-3" bg="secondary">
        {t('heldInWallet')}
      </Badge>
      {/* HELD LP TOKENS */}
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
                  className="rounded-circle"
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
                  <Col className="float-left">
                    <strong>{`${
                      _getToken(asset.tokenAddress)?.symbol
                    }p`}</strong>
                    <div className="text-sm-label">
                      {formatFromWei(asset.balance)}
                    </div>
                  </Col>

                  {!showUsd ? (
                    <Col
                      className="text-sm-label text-end hide-i5"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div>
                        ~
                        {formatFromWei(getLPsValue(asset, asset.balance)[1], 2)}
                        <img
                          height="15px"
                          src={_getToken(asset.tokenAddress)?.symbolUrl}
                          alt={_getToken(asset.tokenAddress)?.name}
                          className="rounded-circle ms-1"
                        />
                        <br />~
                        {formatFromWei(getLPsValue(asset, asset.balance)[0], 2)}
                        <img
                          src={spartaIcon}
                          height="15px"
                          className="rounded-circle ms-1"
                          alt="sparta icon"
                        />
                      </div>
                    </Col>
                  ) : (
                    <Col
                      className="hide-i5"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div className="text-end mt-2 text-sm-label">
                        {spartaPrice > 0
                          ? `~$${formatFromWei(
                              getUSD(asset.tokenAddress, asset.balance),
                              0,
                            )}`
                          : ''}
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>

              <Col
                className="text-center me-1 mt-1"
                style={{ maxWidth: '75px' }}
              >
                <Row>
                  <Col xs="6" className="p-0">
                    <ShareLink url={asset.address}>
                      <Icon icon="copy" size="16" />
                    </ShareLink>
                  </Col>
                  {getWalletType() && (
                    <Col xs="6" className="p-0">
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
                            <Icon icon="metamask" role="button" size="22" />
                          ) : getWalletType() === 'TW' ? (
                            <Icon icon="trustwallet" role="button" size="22" />
                          ) : (
                            getWalletType() === 'BRAVE' && (
                              <Icon icon="brave" size="22" />
                            )
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
          <>
            <hr />
            <Badge bg="secondary" className="mb-3">
              {t('stakedInDaoVault')}
            </Badge>
          </>
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
                  className="rounded-circle"
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
                  <Col xs="auto" className="float-left">
                    <strong>{`${
                      _getToken(asset.tokenAddress)?.symbol
                    }p`}</strong>
                    <div className="text-sm-label">
                      {formatFromWei(asset.staked, 2)}
                    </div>
                  </Col>

                  {!showUsd ? (
                    <Col
                      className="hide-i5 text-sm-label text-end"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div>
                        ~{formatFromWei(getLPsValue(asset, asset.staked)[1], 2)}
                        <img
                          height="15px"
                          src={_getToken(asset.tokenAddress)?.symbolUrl}
                          alt={_getToken(asset.tokenAddress)?.name}
                          className="rounded-circle ms-1"
                        />
                        <br />~
                        {formatFromWei(getLPsValue(asset, asset.staked)[0], 2)}
                        <img
                          src={spartaIcon}
                          height="15px"
                          className="rounded-circle ms-1"
                          alt="sparta icon"
                        />
                      </div>
                    </Col>
                  ) : (
                    <Col
                      className="hide-i5 text-sm-label text-end"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div className="text-end mt-2">
                        {spartaPrice > 0
                          ? `~$${formatFromWei(
                              getUSD(asset.tokenAddress, asset.staked),
                              0,
                            )}`
                          : ''}
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>

              <Col
                className="text-center me-1 mt-1"
                style={{ maxWidth: '75px' }}
              >
                {' '}
                <Row>
                  <Col xs="6" className="p-0">
                    <ShareLink url={asset.address}>
                      <Icon icon="copy" role="button" size="16" />
                    </ShareLink>
                  </Col>
                  {getWalletType() && (
                    <Col xs="6" className="p-0">
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
                            getWalletType() === 'TW' && (
                              <Icon
                                icon="trustwallet"
                                role="button"
                                size="24"
                              />
                            )
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
          <>
            <hr />
            <Badge className="mb-3" bg="secondary">
              {t('stakedInBondVault')}
            </Badge>
          </>
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
                  className="rounded-circle"
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
                  <Col xs="auto" className="float-left">
                    <strong>{`${
                      _getToken(asset.tokenAddress)?.symbol
                    }p`}</strong>
                    <div className="text-sm-label">
                      {formatFromWei(asset.staked)}
                    </div>
                  </Col>
                  {!showUsd ? (
                    <Col
                      className="hide-i5 text-sm-label text-end"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div>
                        ~{formatFromWei(getLPsValue(asset, asset.staked)[1], 2)}
                        <img
                          height="15px"
                          src={_getToken(asset.tokenAddress)?.symbolUrl}
                          alt={_getToken(asset.tokenAddress)?.name}
                          className="rounded-circle ms-1"
                        />
                        <br />~
                        {formatFromWei(getLPsValue(asset, asset.staked)[0], 2)}
                        <img
                          src={spartaIcon}
                          height="15px"
                          className="rounded-circle ms-1"
                          alt="sparta icon"
                        />
                      </div>
                    </Col>
                  ) : (
                    <Col
                      className="hide-i5"
                      role="button"
                      onClick={() => handleChangeShow()}
                    >
                      <div className="text-end mt-2 text-sm-label">
                        {spartaPrice > 0
                          ? `~$${formatFromWei(
                              getUSD(asset.tokenAddress, asset.staked),
                              0,
                            )}`
                          : ''}
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>

              <Col
                className="text-center me-1 mt-1"
                style={{ maxWidth: '75px' }}
              >
                <Row>
                  <Col xs="6" className="p-0">
                    <ShareLink url={asset.address}>
                      <Icon icon="copy" role="button" size="16" />
                    </ShareLink>
                  </Col>
                  {getWalletType() && (
                    <Col xs="6" className="p-0">
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
                            getWalletType() === 'TW' && (
                              <Icon
                                icon="trustwallet"
                                role="button"
                                size="24"
                              />
                            )
                          )}
                        </div>
                      </a>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          ))}
      {!isLoading() && getTotalValue()}
      {isLoading() && (
        <Col className="card-480">
          <HelmetLoading height={100} width={100} />
        </Col>
      )}
    </>
  )
}

export default LPs
