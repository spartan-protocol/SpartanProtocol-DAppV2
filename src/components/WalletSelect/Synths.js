import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { useWeb3, watchAsset } from '../../store/web3'
import { getNetwork, tempChains } from '../../utils/web3'
import { convertFromWei, formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { useSynth, getSynthDetails } from '../../store/synth'
import { Icon } from '../Icons/icons'
import spartaSynthIcon from '../../assets/tokens/sparta-synth.svg'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'

const Synths = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const synth = useSynth()
  const web3 = useWeb3()

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork()
    }
  }

  useEffect(() => {
    const { listedPools } = pool
    const { synthArray } = synth
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (synthArray?.length > 0 && listedPools?.length > 0) {
          dispatch(getSynthDetails(synthArray, wallet))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

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

  return (
    <>
      {/* HELD SYNTHS */}
      {synth.synthDetails
        ?.filter((asset) => asset.balance > 0)
        .sort(
          (a, b) =>
            convertFromWei(getUSD(b.tokenAddress, b.balance)) -
            convertFromWei(getUSD(a.tokenAddress, a.balance)),
        ).length > 0 ? (
        <>
          {synth.synthDetails
            ?.filter((asset) => asset.balance > 0)
            .map((asset) => (
              <Row key={`${asset.address}-synth`} className="mb-3 output-card">
                <Col xs="auto" className="position-relative pe-1">
                  <img
                    height="35px"
                    src={getToken(asset.tokenAddress)?.symbolUrl}
                    alt={getToken(asset.tokenAddress)?.name}
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
                    <Col xs="auto">
                      {`${getToken(asset.tokenAddress)?.symbol}s - ${t(
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
                              <Icon
                                icon="trustwallet"
                                role="button"
                                size="24"
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
      ) : (
        'No synthetic assets held in wallet'
      )}
      {/* STAKED SYNTHS */}
      {synth.synthDetails?.filter((asset) => asset.staked > 0).length > 0 && (
        <hr />
      )}
      {synth.synthDetails
        ?.filter((asset) => asset.staked > 0)
        .sort(
          (a, b) =>
            convertFromWei(getUSD(b.tokenAddress, b.balance)) -
            convertFromWei(getUSD(a.tokenAddress, a.balance)),
        )
        .map((asset) => (
          <Row key={`${asset.address}-synthstake`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative pe-1">
              <img
                height="35px"
                src={getToken(asset.tokenAddress)?.symbolUrl}
                alt={getToken(asset.tokenAddress)?.name}
              />
              <img
                src={spartaSynthIcon}
                height="20px"
                className="token-badge"
                alt={`${getToken(asset.tokenAddress)?.symbol} synth token icon`}
              />
            </Col>
            <Col className="align-items-center">
              <Row>
                <Col xs="auto">
                  {`${getToken(asset.tokenAddress)?.symbol}s - ${t('staked')}`}
                  <div className="description">
                    {formatFromWei(asset.staked)}
                  </div>
                </Col>
                <Col className="hide-i5">
                  <div className="text-end mt-2">
                    ~$
                    {formatFromWei(getUSD(asset.tokenAddress, asset.staked), 0)}
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

export default Synths
