import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { watchAsset } from '../../store/web3'
import { formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { useSynth, getSynthDetails } from '../../store/synth'
import { Icon } from '../Icons/icons'
import spartaSynthIcon from '../../assets/tokens/sparta-synth.svg'
import { getNetwork } from '../../utils/web3'

const Synths = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const synth = useSynth()

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
      if (tryParse(window.localStorage.getItem('network'))?.chainId === 97) {
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
      {synth.synthDetails?.filter((asset) => asset.balance > 0).length > 0 ? (
        <>
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
                    src={spartaSynthIcon}
                    height="20px"
                    className="token-badge"
                    alt={`${
                      getToken(asset.tokenAddress)?.symbol
                    } synth token icon`}
                  />
                </Col>

                <Col xs="5" sm="7" className="align-items-center">
                  <Row>
                    <Col xs="12" className="float-left">
                      {`${getToken(asset.tokenAddress)?.symbol}s - ${t(
                        'wallet',
                      )}`}
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
                              handleWatchAsset('synth', asset)
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
        .map((asset) => (
          <Row key={`${asset.address}-synthstake`} className="mb-3 output-card">
            <Col xs="auto" className="position-relative">
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
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {`${getToken(asset.tokenAddress)?.symbol}s - ${t('staked')}`}
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
                          handleWatchAsset('synth', asset)
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
