import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { useDispatch } from 'react-redux'
import spartaIconAlt from '../../assets/tokens/sparta-synth.svg'
import { usePool } from '../../store/pool'
import { synthVaultWeight, useSynth } from '../../store/synth'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatShortNumber,
} from '../../utils/bigNumber'
import { Tooltip } from '../../components/Tooltip/index'
import styles from './styles.module.scss'
import { getSynth } from '../../utils/math/utils'
import { stirCauldron } from '../../utils/math/router'

const SynthTableItem = ({ asset, synthApy }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const synth = useSynth()
  const history = useNavigate()
  const web3 = useWeb3()
  const { tokenAddress, baseAmount, tokenAmount } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)

  const _getSynth = () => getSynth(tokenAddress, synth.synthDetails)
  const getSynthSupply = () => _getSynth().totalSupply

  const getSynthStir = () => stirCauldron(asset, asset.tokenAmount, _getSynth())
  const getSynthCapPC = () =>
    BN(getSynthSupply())
      .div(BN(getSynthSupply()).plus(getSynthStir()))
      .times(100)

  useEffect(() => {
    const checkWeight = () => {
      if (pool.poolDetails?.length > 1) {
        dispatch(
          synthVaultWeight(synth.synthDetails, pool.poolDetails, web3.rpcs),
        )
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.synthDetails, pool.poolDetails])

  return (
    <>
      <tr className={`${styles.poolTableItem} bg-2`}>
        {/* synth */}
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
              src={spartaIconAlt}
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
              <span role="button">{`$${formatFromUnits(
                tokenValueUSD,
                2,
              )}`}</span>
            </OverlayTrigger>
          </div>
        </td>

        {/* synth cap */}
        <td className="d-none d-sm-table-cell">
          <div>
            {formatShortNumber(convertFromWei(getSynthSupply()))}
            <span className="">
              {' / '}
              {formatShortNumber(
                convertFromWei(BN(getSynthSupply()).plus(getSynthStir())),
              )}
            </span>
          </div>
          <div className="mt-1">
            <ProgressBar style={{ height: '5px' }}>
              <ProgressBar
                variant={getSynthCapPC() > 95 ? 'danger' : 'success'}
                key={1}
                now={getSynthCapPC()}
              />
            </ProgressBar>
          </div>
        </td>
        {/* depth */}
        <td className="d-none d-sm-table-cell">
          {formatFromUnits(BN(getSynthSupply()).div(tokenAmount).times(100), 2)}
          %
        </td>
        {/* apy */}
        <td className="">{formatFromUnits(synthApy, 2)}%</td>
        {/* actions (buttons) */}
        <td className="">
          <Row className="text-center mt-2 me-1">
            <Col xs="12" md="6">
              <Button
                size="sm"
                variant="outline-secondary"
                className="w-100 mb-2"
                disabled={!asset.curated}
                onClick={() => history.push('/vaults?tab=Synth')}
              >
                {t('stake')}
              </Button>
            </Col>
            <Col xs="12" md="6">
              <Button
                size="sm"
                variant="outline-secondary"
                className="w-100 mb-2"
                onClick={() => history.push(`/synths?asset2=${tokenAddress}`)}
              >
                {t('forge')}
              </Button>
            </Col>
          </Row>
        </td>
      </tr>
    </>
  )
}

export default SynthTableItem
