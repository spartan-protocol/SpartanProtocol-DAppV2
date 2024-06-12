import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Popover from 'react-bootstrap/Popover'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
// import { Icon } from '../../components/Icons/index'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatShortNumber,
  formatFromWei,
} from '../../utils/bigNumber'
// import { calcAPY } from '../../utils/math/nonContract'
import { Tooltip } from '../../components/Tooltip/index'
import spartaIcon from '../../assets/tokens/spartav2.svg'
import styles from './styles.module.scss'
import { useApp } from '../../store/app'

const PoolTableItem = ({ asset }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { addresses } = useApp()
  const pool = usePool()
  const web3 = useWeb3()

  const [spartaPrice, setspartaPrice] = useState(0)

  const { tokenAddress, baseAmount, tokenAmount, baseCap } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(spartaPrice)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  // const getFees = () =>
  //   pool.incentives
  //     ? pool.incentives.filter((x) => x.address === asset.address)[0]?.fees
  //     : 0

  // const getDivis = () =>
  //   curated && pool.incentives
  //     ? pool.incentives.filter((x) => x.address === asset.address)[0]
  //         ?.incentives
  //     : 0

  // const getVol = () => {
  //   if (!pool.incentives) return 0
  //   const _item = pool.incentives.filter((x) => x.address === asset.address)[0]
  //   if (!_item) return 0
  //   const isRecent = pool.incentives[0].timestamp - _item.timestamp < 172800
  //   if (!isRecent) return 0
  //   return _item.volume
  // }

  // const APY = calcAPY(asset, getFees(), getDivis())

  const isAtCaps = () => {
    if (BN(baseCap).lt('1000000000000000000000000')) {
      return BN(baseAmount).gt(BN(baseCap).minus('10000000000000000000000'))
    }
    return BN(baseAmount).gt(BN(baseCap).minus('50000000000000000000000'))
  }

  const getDepthPC = () => BN(baseAmount).div(asset.baseCap).times(100)

  const getTVL = () => {
    let tvl = BN(0)
    tvl = tvl.plus(baseAmount)
    tvl = tvl.times(2).times(spartaPrice)
    return tvl > 0 ? tvl : '0.00'
  }

  return (
    <>
      <tr className={`${styles.poolTableItem} bg-2`}>
        {/* pool */}
        <td style={{ width: '80px' }}>
          <div className="position-relative py-2 d-inline-block">
            <img
              src={token.symbolUrl}
              className="rounded-circle"
              alt={token.symbol}
              height="45"
            />
            <img
              height="25px"
              src={spartaIcon}
              alt="Sparta synth token icon"
              className="position-absolute"
              style={{ left: '25px', bottom: '5px' }}
            />
          </div>
        </td>
        <td className="text-start">
          <div className="d-inline-block align-middle">
            <h4 className="mb-0">{token.symbol}</h4>
            <OverlayTrigger
              placement="auto"
              overlay={Tooltip(t, `$${formatFromUnits(tokenValueUSD, 18)}`)}
            >
              <span role="button">
                {spartaPrice > 0 ? `$${formatFromUnits(tokenValueUSD, 2)}` : ''}
              </span>
            </OverlayTrigger>
          </div>
        </td>
        {/* pool cap */}
        <td className="d-none d-md-table-cell">
          <div>
            {formatShortNumber(convertFromWei(baseAmount))}
            <span>
              {' / '}
              {formatShortNumber(convertFromWei(asset.baseCap))}
            </span>
          </div>
          <div className="mt-1">
            <ProgressBar style={{ height: '5px' }}>
              <ProgressBar
                variant={isAtCaps() ? 'danger' : 'success'}
                key={1}
                now={getDepthPC()}
              />
            </ProgressBar>
          </div>
        </td>
        {/* liquidity */}
        <td className="d-none d-sm-table-cell">
          {getTVL() > 0 ? `$${formatFromWei(getTVL(), 0)}` : '...'}
        </td>
        {/* volume */}
        {/* <td className="d-none d-sm-table-cell">
          {getVol() > 0 ? `$${formatFromWei(getVol(), 0)}` : '...'}
        </td> */}
        {/* apy */}
        {/* <td>
          {formatFromUnits(curated && daoApy ? BN(APY).plus(daoApy) : APY, 2)}%
          <br />
          <small>Info</small>
          <OverlayTrigger
            placement="auto"
            overlay={
              <Popover>
                <Popover.Body>
                  <Row>
                    <Col xs="6">{t('poolApy')}</Col>
                    <Col xs="6" className="text-end">
                      {formatFromUnits(APY, 2)}%
                    </Col>
                    <Col xs="6">{t('vaultApy')}</Col>
                    <Col xs="6" className="text-end">
                      {curated
                        ? `${formatFromUnits(daoApy, 2)}%`
                        : t('notCurated')}
                    </Col>
                    <Col xs="12">
                      <hr className="my-2" />
                    </Col>
                    <Col xs="6">
                      <strong>{t('totalApy')}</strong>
                    </Col>
                    <Col xs="6" className="text-end">
                      <strong>
                        {formatFromUnits(
                          curated && daoApy ? BN(APY).plus(daoApy) : APY,
                          2,
                        )}
                        %
                      </strong>
                    </Col>
                    <Col xs="12">
                      <hr className="my-2" />
                    </Col>
                    <Col xs="12" className="text-center">
                      {t('apyEstimatedInfo')}
                    </Col>
                  </Row>
                </Popover.Body>
              </Popover>
            }
          >
            <span role="button">
              <Icon icon="info" className="ms-1 mb-1" size="17" />
            </span>
          </OverlayTrigger>
        </td> */}
        {/* actions (buttons) */}
        <td>
          <Row className="text-center mt-2 me-1">
            <Col xs="12" md="6">
              <Button
                size="sm"
                variant="outline-secondary"
                className="w-100 mb-2"
                onClick={() =>
                  navigate(
                    `/swap?asset1=${tokenAddress}&asset2=${addresses.spartav2}&type1=token&type2=token`,
                  )
                }
              >
                {t('swap')}
              </Button>
            </Col>

            <Col xs="12" md="6">
              <Button
                size="sm"
                variant="outline-secondary"
                className="w-100 mb-2"
                onClick={() => navigate(`/liquidity?asset1=${tokenAddress}`)}
              >
                {t('join')}
              </Button>
            </Col>

            {/* {asset.curated && (
              <Col xs="12">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="w-100 mb-2"
                  disabled={!asset.curated}
                  onClick={() => navigate('/vaults')}
                >
                  {t('stake')}
                </Button>
              </Col>
            )} */}
          </Row>
        </td>
      </tr>
    </>
  )
}

export default PoolTableItem
