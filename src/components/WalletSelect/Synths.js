import { useWallet } from '@binance-chain/bsc-use-wallet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { usePool } from '../../store/pool'
import { watchAsset } from '../../store/web3'
import { formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import walletTypes from './walletTypes'
import spartaIconAlt from '../../assets/img/spartan_synth.svg'
import { useSynth } from '../../store/synth'

const Synths = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const synth = useSynth()

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getWalletType = () => {
    if (wallet.ethereum?.isMetaMask) {
      return 'MM'
    }
    if (wallet.ethereum?.isTrust) {
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
      {/* HELD SYNTHS */}
      {synth.synthDetails?.filter((asset) => asset.balance > 0).length > 0 && (
        <Row className="my-3">
          <Col xs="9">
            <div className="text-card">{t('wallet')}</div>
          </Col>
          <Col xs="3">
            <div className="text-card text-right">{t('actions')}</div>
          </Col>
        </Row>
      )}
      {synth.synthDetails
        ?.filter((asset) => asset.balance > 0)
        .map((asset) => (
          <Row key={`${asset.address}-synth`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
              <img
                height="35px"
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                height="20px"
                src={spartaIconAlt}
                alt="SPARTA"
                className="position-absolute"
                style={{ left: '28px', top: '18px' }}
              />
            </Col>

            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}s`}
                  <div className="description">
                    {formatFromWei(asset.balance)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="3" className="text-right">
              <Row>
                <Col xs="6" className="mt-1">
                  <ShareLink url={asset.address} notificationLocation="tc">
                    <i className="icon-small icon-copy align-middle" />
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
                          handleWatchAsset('synth', asset)
                        }}
                      >
                        {getWalletType() === 'MM' ? (
                          <i className="icon-small icon-metamask icon-light ml-2" />
                        ) : (
                          <img
                            src={
                              walletTypes.filter((x) => x.id === 'TW')[0]?.icon
                            }
                            alt="TrustWallet icon"
                            height="24"
                          />
                        )}
                      </div>
                    </a>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        ))}
      {/* STAKED SYNTHS */}
      {synth.synthDetails?.filter((asset) => asset.staked > 0).length > 0 && (
        <Row className="my-3">
          <Col xs="9">
            <div className="text-card">Staked</div>
          </Col>
          <Col xs="3">
            <div className="text-card text-right">Actions</div>
          </Col>
        </Row>
      )}
      {synth.synthDetails
        ?.filter((asset) => asset.staked > 0)
        .map((asset) => (
          <Row key={`${asset.address}-synthstake`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
              <img
                height="35px"
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                height="20px"
                src={spartaIconAlt}
                alt="SPARTA"
                className="position-absolute"
                style={{ left: '28px', top: '18px' }}
              />
            </Col>
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}s`}
                  <div className="description">
                    {formatFromWei(asset.staked)}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs="3" className="text-right">
              <Row>
                <Col xs="6" className="mt-1">
                  <ShareLink url={asset.address} notificationLocation="tc">
                    <i className="icon-small icon-copy align-middle" />
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
                          handleWatchAsset('synth', asset)
                        }}
                      >
                        {getWalletType() === 'MM' ? (
                          <i className="icon-small icon-metamask icon-light ml-2" />
                        ) : (
                          <img
                            src={
                              walletTypes.filter((x) => x.id === 'TW')[0]?.icon
                            }
                            alt="TrustWallet icon"
                            height="24"
                          />
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

export default Synths
