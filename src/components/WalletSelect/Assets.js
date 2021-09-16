import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { watchAsset } from '../../store/web3'
import { formatFromWei } from '../../utils/bigNumber'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/icons'

const Assets = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()

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

  return (
    <>
      {pool.tokenDetails
        ?.filter((asset) => asset.balance > 0)
        .sort(
          (a, b) =>
            Number(formatFromWei(a.balance)) - Number(formatFromWei(b.balance)),
          //  sorted by balance,
          //  should multiply it by
          //  pool.poolDetails.find(
          //    (x) => x.tokenAddress === asset.address,
          //  ).newRate
          //  and then
          //  divide it to have the real Spot Price and multiply it by the SPARTAN value
        )
        .map((asset) => (
          <Row key={`${asset.address}-asset`} className="mb-3 output-card">
            <Col xs="auto">
              <img
                height="35px"
                src={asset.symbolUrl}
                alt={asset.name}
                className="mr-4"
              />
            </Col>
            <Col xs="5" sm="7" className="align-items-center">
              <Row>
                <Col xs="12" className="float-left">
                  {asset.symbol} - {t('wallet')}
                  <div className="description">
                    {formatFromWei(asset.balance)}
                    {'  $'}
                    {
                      pool.poolDetails.find(
                        (x) => x.tokenAddress === asset.address,
                      ).newRate > 0
                        ? pool.poolDetails.find(
                            (x) => x.tokenAddress === asset.address,
                          ).newRate
                        : 1
                      //  pool.poolDetails.find(
                      //    (x) => x.tokenAddress === asset.address,
                      //  ).newRate
                      //  divide it to have the real Spot Price and multiply it by the SPARTAN value

                      // the greater than 0 is because Spartan has the newRate value on poolDetails set to 0
                      // this gets the value newRate from the poolDetails,
                      // aka Spot Price (as Number, has to get divided by an amount)
                    }
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

export default Assets
