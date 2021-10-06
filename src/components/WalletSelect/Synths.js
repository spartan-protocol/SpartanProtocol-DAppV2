import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Badge, Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { useWeb3, watchAsset } from '../../store/web3'
import { BN, convertFromWei, formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { useSynth } from '../../store/synth'
import { Icon } from '../Icons/icons'
import spartaSynthIcon from '../../assets/tokens/sparta-synth.svg'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'
import HelmetLoading from '../Loaders/HelmetLoading'

const Synths = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const synth = useSynth()
  const web3 = useWeb3()

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

  const handleWatchAsset = (asset) => {
    const walletType = getWalletType()
    const token = getToken(asset.tokenAddress)
    if (walletType === 'MM') {
      dispatch(
        watchAsset(
          asset.address,
          `${token?.symbol.substring(0, 10)}s`,
          '18',
          token?.symbolUrl,
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

  /** @returns BN(usdValue) */
  const getUSD = (tokenAddr, amount) => {
    if (pool.poolDetails.length > 1) {
      if (_getPool) {
        return calcSpotValueInBase(amount, _getPool(tokenAddr)).times(
          web3.spartaPrice,
        )
      }
    }
    return '0.00'
  }

  const isLoading = () => {
    if (!synth.synthDetails) {
      return true
    }
    return false
  }

  /* eslint no-return-assign: "error" */

  const getTotalValue = () => {
    let total = BN(0)
    synth.synthDetails
      ?.filter((asset) => asset.balance > 0)
      .forEach(
        (asset) =>
          (total = total.plus(getUSD(asset.tokenAddress, asset.balance))),
      )
    synth.synthDetails
      ?.filter((asset) => asset.staked > 0)
      .forEach(
        (asset) =>
          (total = total.plus(getUSD(asset.tokenAddress, asset.staked))),
      )

    if (!total.isZero()) {
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
                <Col xs="auto" className="float-left">
                  {t('total')}
                </Col>
                <Col>
                  <div className="text-sm-label text-end">
                    ~${formatFromWei(total, 0)}
                    <Icon icon="usd" size="15" fill="black" className="ms-1" />
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              className="text-center me-1 mt-1"
              style={{ maxWidth: '80px' }}
            />
          </Row>
        </div>
      )
    }
    return ''
  }

  return (
    <>
      {/* HELD SYNTHS */}
      {!isLoading() &&
      synth.synthDetails?.filter((asset) => asset.balance > 0).length > 0 ? (
        <>
          {synth.synthDetails
            ?.filter((asset) => asset.balance > 0)
            .sort(
              (a, b) =>
                convertFromWei(getUSD(b.tokenAddress, b.balance)) -
                convertFromWei(getUSD(a.tokenAddress, a.balance)),
            )
            .map((asset) => (
              <Row key={`${asset.address}-synth`} className="mb-3 output-card">
                <Col xs="auto" className="position-relative pe-1">
                  <img
                    height="35px"
                    src={getToken(asset.tokenAddress)?.symbolUrl}
                    alt={getToken(asset.tokenAddress)?.name}
                    className="rounded-circle"
                  />
                  <img
                    src={spartaSynthIcon}
                    height="20px"
                    className="token-badge"
                    alt={`${
                      getToken(asset.tokenAddress)?.symbol
                    } synth token icon`}
                  />
                </Col>

                <Col className="align-items-center">
                  <Row>
                    <Col xs="auto" className="float-left">
                      <Badge className="me-1">{t('wallet')}</Badge>
                      {`${getToken(asset.tokenAddress)?.symbol}s`}
                      <div className="text-sm-label">
                        {formatFromWei(asset.balance)}
                      </div>
                    </Col>
                    <Col className="hide-i5">
                      <div className="text-sm-label text-end mt-2">
                        ~$
                        {formatFromWei(
                          getUSD(asset.tokenAddress, asset.balance),
                          0,
                        )}
                        <Icon
                          icon="usd"
                          size="15"
                          fill="black"
                          className="ms-1"
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className="text-center me-1 mt-1"
                  style={{ maxWidth: '80px' }}
                >
                  {' '}
                  <Row>
                    <Col xs="6" className="p-0">
                      <ShareLink url={asset.address}>
                        <Icon icon="copy" size="24" />
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
                              <Icon icon="metamask" size="24" />
                            ) : (
                              <Icon icon="trustwallet" size="24" />
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
      ) : (
        'No synthetic assets held in wallet'
      )}
      {/* STAKED SYNTHS */}
      {!isLoading() &&
        synth.synthDetails?.filter((asset) => asset.staked > 0).length > 0 && (
          <>
            <hr />
            {synth.synthDetails
              ?.filter((asset) => asset.staked > 0)
              .sort(
                (a, b) =>
                  convertFromWei(getUSD(b.tokenAddress, b.staked)) -
                  convertFromWei(getUSD(a.tokenAddress, a.staked)),
              )
              .map((asset) => (
                <Row
                  key={`${asset.address}-synthstake`}
                  className="mb-3 output-card"
                >
                  <Col xs="auto" className="position-relative pe-1">
                    <img
                      height="35px"
                      src={getToken(asset.tokenAddress)?.symbolUrl}
                      alt={getToken(asset.tokenAddress)?.name}
                      className="rounded-circle"
                    />
                    <img
                      src={spartaSynthIcon}
                      height="20px"
                      className="token-badge"
                      alt={`${
                        getToken(asset.tokenAddress)?.symbol
                      } synth token icon`}
                    />
                  </Col>
                  <Col className="align-items-center">
                    <Row>
                      <Col xs="auto" className="float-left">
                        <Badge className="me-1">{t('staked')}</Badge>
                        {`${getToken(asset.tokenAddress)?.symbol}s`}
                        <div className="text-sm-label">
                          {formatFromWei(asset.staked)}
                        </div>
                      </Col>
                      <Col className="hide-i5">
                        <div className="text-sm-label text-end mt-2">
                          ~$
                          {formatFromWei(
                            getUSD(asset.tokenAddress, asset.staked),
                            0,
                          )}
                          <Icon
                            icon="usd"
                            size="15"
                            fill="black"
                            className="ms-1"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className="text-center me-1 mt-1"
                    style={{ maxWidth: '80px' }}
                  >
                    <Row>
                      <Col xs="6" className="p-0">
                        <ShareLink url={asset.address}>
                          <Icon icon="copy" size="24" />
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
                                <Icon icon="metamask" size="24" />
                              ) : (
                                <Icon icon="trustwallet" size="24" />
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
        )}
      {!isLoading() && getTotalValue()}

      {isLoading() && (
        <Col className="card-480">
          <HelmetLoading height={300} width={300} />
        </Col>
      )}
    </>
  )
}

export default Synths
