import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCol,
  MDBRow,
  MDBTooltip,
} from 'mdb-react-ui-kit'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'
import downIcon from '../../../assets/icons/arrow-down-light.svg'
import upIcon from '../../../assets/icons/arrow-up-light.svg'

const PoolItem = ({ asset }) => {
  const { t } = useTranslation()
  const pool = usePool()
  const history = useHistory()
  const web3 = useWeb3()
  const [showDetails, setShowDetails] = useState(false)
  const {
    tokenAddress,
    baseAmount,
    tokenAmount,
    recentDivis,
    lastMonthDivis,
    recentFees,
    lastMonthFees,
    genesis,
  } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)
  const poolDepthUsd = BN(baseAmount).times(2).times(web3?.spartaPrice)
  const APY = formatFromUnits(
    calcAPY(
      recentDivis,
      lastMonthDivis,
      recentFees,
      lastMonthFees,
      genesis,
      baseAmount,
    ),
    2,
  )

  const poolAgeDays = (Date.now() - genesis * 1000) / 1000 / 60 / 60 / 24

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  return (
    <>
      <MDBCol size="auto">
        <MDBCard className="card-body card-320 pt-3 pb-2 card-underlay">
          <MDBRow className="mb-2">
            <MDBCol size="auto" className="pr-0">
              <img src={token.symbolUrl} alt={token.symbol} height="50" />
            </MDBCol>
            <MDBCol size="auto">
              <h3 className="mb-0">{token.symbol}</h3>
              <p className="text-sm-label-alt">
                ${formatFromUnits(tokenValueUSD, 2)}
              </p>
            </MDBCol>
            <MDBCol className="text-right mt-1 p-0 pr-2">
              <p className="text-sm-label d-inline-block">APY</p>
              <MDBTooltip
                tag="i"
                wrapperClass="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                title={t('apyInfo')}
                placement="auto"
              />
              <p className="output-card">{APY}%</p>
            </MDBCol>
            <MDBCol size="auto" className="text-right my-auto p-0 px-2">
              <img
                onClick={() => toggleCollapse()}
                src={showDetails ? upIcon : downIcon}
                alt={showDetails ? 'upIcon' : 'downIcon'}
                className="swap-icon-color"
                aria-hidden="true"
                style={{
                  cursor: 'pointer',
                  height: '30px',
                  width: '30px',
                  top: '-15px',
                }}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="my-1">
            <MDBCol size="auto" className="text-card">
              {t('spotPrice')}
            </MDBCol>
            <MDBCol className="text-right output-card">
              {formatFromUnits(tokenValueBase, 2)} SPARTA
            </MDBCol>
          </MDBRow>

          <MDBRow className="my-1">
            <MDBCol size="auto" className="text-card">
              {t('poolDepth')}
            </MDBCol>
            <MDBCol className="text-right output-card">
              ${formatFromWei(poolDepthUsd, 0)} USD
            </MDBCol>
          </MDBRow>
          {showDetails === true && (
            <>
              <MDBRow className="my-1">
                <MDBCol size="auto" className="text-card">
                  {t('fees')}
                  <MDBTooltip
                    tag="i"
                    wrapperClass="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                    title={t('swapRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                    placement="auto"
                  />
                </MDBCol>
                <MDBCol className="text-right output-card">
                  {lastMonthFees > 0
                    ? formatFromWei(lastMonthFees, 0)
                    : formatFromWei(recentFees, 0)}{' '}
                  SPARTA
                </MDBCol>
              </MDBRow>

              <MDBRow className="my-1">
                <MDBCol size="auto" className="text-card">
                  {t('dividends')}
                  <MDBTooltip
                    tag="i"
                    wrapperClass="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                    title={t('dividendRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                    placement="auto"
                  />
                </MDBCol>
                <MDBCol className="text-right output-card">
                  {asset.curated === true &&
                    lastMonthDivis > 0 &&
                    `${formatFromWei(lastMonthDivis, 0)} SPARTA`}
                  {asset.curated === true &&
                    lastMonthDivis <= 0 &&
                    `${formatFromWei(recentDivis, 0)} SPARTA`}
                  {asset.curated === false && t('notCurated')}
                </MDBCol>
              </MDBRow>
            </>
          )}
          <MDBRow className="text-center mt-2">
            <MDBBtnGroup size="sm">
              <MDBBtn
                onClick={() =>
                  history.push(`/pools/swap?asset1=${tokenAddress}`)
                }
              >
                {t('swap')}
              </MDBBtn>
              <MDBBtn
                onClick={() =>
                  history.push(`/pools/liquidity?asset1=${tokenAddress}`)
                }
              >
                {t('join')}
              </MDBBtn>
              <MDBBtn onClick={() => history.push('/vault')}>
                {t('stake')}
              </MDBBtn>
            </MDBBtnGroup>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    </>
  )
}

export default PoolItem
