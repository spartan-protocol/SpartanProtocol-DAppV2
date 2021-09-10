import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { usePool } from '../../store/pool'
import { watchAsset } from '../../store/web3'
import { formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/icons'
import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'

const LPs = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const dispatch = useDispatch()

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getWalletType = () => {
    if (window.ethereum?.isMetaMask) {
      return 'MM'
    }
    if (window.ethereum?.isTrust) {
      return 'TW'
    }
    return false
  }

  const handleWatchAsset = (assetType, asset) => {
    const walletType = getWalletType()
    const token = getToken(asset.tokenAddress)
    if (walletType === 'MM') {
      if (assetType === 'token') {
        dispatch(
          watchAsset(
            asset.address,
            asset.symbol.substring(0, 11),
            '18',
            asset.symbolUrl,
          ),
        )
      } else if (assetType === 'pool') {
        dispatch(
          watchAsset(
            asset.address,
            `${token?.symbol.substring(0, 10)}p`,
            '18',
            token?.symbolUrl,
          ),
        )
      } else if (assetType === 'synth') {
        dispatch(
          watchAsset(
            asset.address,
            `${token?.symbol.substring(0, 10)}s`,
            '18',
            token?.symbolUrl,
          ),
        )
      }
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
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                src={spartaLpIcon}
                height="20px"
                className="token-badge"
                alt={`${getToken(asset.tokenAddress)?.symbol} LP token icon`}
              />
            </Col>
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}p - ${t('wallet')}`}
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
                          handleWatchAsset('pool', asset)
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
      {pool.poolDetails?.filter((asset) => asset.staked > 0).length > 0 && (
        <hr />
      )}
      {pool.poolDetails
        ?.filter((asset) => asset.staked > 0)
        .map((asset) => (
          <Row key={`${asset.address}-lpdao`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
              <img
                height="35px"
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                src={spartaLpIcon}
                height="20px"
                className="token-badge"
                alt={`${getToken(asset.tokenAddress)?.symbol} LP token icon`}
              />
            </Col>
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}p - ${t('staked')}`}
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
                          handleWatchAsset('pool', asset)
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
      {pool.poolDetails?.filter((asset) => asset.bonded > 0).length > 0 && (
        <hr />
      )}
      {pool.poolDetails
        ?.filter((asset) => asset.bonded > 0)
        .map((asset) => (
          <Row key={`${asset.address}-lpbond`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
              <img
                height="35px"
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                src={spartaLpIcon}
                height="20px"
                className="token-badge"
                alt={`${getToken(asset.tokenAddress)?.symbol} LP token icon`}
              />
            </Col>
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}p - ${t('bond')}`}
                  <div className="description">
                    {formatFromWei(asset.bonded)}
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
                          handleWatchAsset('pool', asset)
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
