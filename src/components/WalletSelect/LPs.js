import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { watchAsset } from '../../store/web3'
import { formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/icons'
import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'
import { getToken } from '../../utils/math/utils'
import { getDaoDetails, useDao } from '../../store/dao'
import { getBondDetails, useBond } from '../../store/bond'
import { getNetwork, tempChains } from '../../utils/web3'

const LPs = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
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

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork()
    }
  }

  useEffect(() => {
    const { listedPools } = pool
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (listedPools?.length > 0) {
          dispatch(getBondDetails(listedPools, wallet))
          dispatch(getDaoDetails(listedPools, wallet))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

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

  return (
    <>
      {/* HELD LP TOKENS */}
      {pool.poolDetails
        ?.filter((asset) => asset.balance > 0)
        .map((asset) => (
          <Row key={`${asset.address}-lp`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
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
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${_getToken(asset.tokenAddress)?.symbol}p - ${t('wallet')}`}
                  <div className="description">
                    {formatFromWei(asset.balance)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="3" className="text-right">
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
      {dao.daoDetails?.filter((asset) => asset.staked > 0).length > 0 && <hr />}
      {dao.daoDetails
        ?.filter((asset) => asset.staked > 0)
        .map((asset) => (
          <Row key={`${asset.address}-lpdao`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
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
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${_getToken(asset.tokenAddress)?.symbol}p - ${t('staked')}`}
                  <div className="description">
                    {formatFromWei(asset.staked)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="3" className="text-right">
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
      {bond.bondDetails?.filter((asset) => asset.staked > 0).length > 0 && (
        <hr />
      )}
      {bond.bondDetails
        ?.filter((asset) => asset.staked > 0)
        .map((asset) => (
          <Row key={`${asset.address}-lpbond`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
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
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${_getToken(asset.tokenAddress)?.symbol}p - ${t('bond')}`}
                  <div className="description">
                    {formatFromWei(asset.staked)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="3" className="text-right">
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

export default LPs
