import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import { Icon } from '../../components/Icons/index'
import spartaIconAlt from '../../assets/tokens/sparta-synth.svg'
import { usePool } from '../../store/pool'
import { synthVaultWeight, useSynth } from '../../store/synth'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatShortNumber,
  formatFromWei,
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
  const history = useHistory()
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
      <tr className={`${styles.poolTableItem}`}>
        {/* synth */}
        <td className="bg-2">
          <tr>
            <td className="bg-2 position-relative p-2 d-none d-sm-table-cell">
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
                style={{ right: '5px', bottom: '10px' }}
              />
            </td>
            <td className="bg-2 ps-2">
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
            </td>
          </tr>
        </td>
        {/* synth cap */}
        <td className="bg-2">
          <div>
            {formatShortNumber(convertFromWei(getSynthSupply()))}
            <span className="d-none d-md-inline">
              {' / '}
              {formatShortNumber(
                convertFromWei(BN(getSynthSupply()).plus(getSynthStir())),
              )}
            </span>
          </div>
          <div className="mt-1 d-none d-md-block">
            <ProgressBar style={{ height: '5px', width: '120px' }}>
              <ProgressBar
                variant={getSynthCapPC() > 95 ? 'danger' : 'success'}
                key={1}
                now={getSynthCapPC()}
              />
            </ProgressBar>
          </div>
        </td>
        {/* token depth */}
        <td className="bg-2 d-none d-sm-table-cell">
          {formatFromWei(tokenAmount)}
        </td>
        {/* synth supply */}
        <td className="bg-2 d-none d-sm-table-cell">
          {formatFromWei(getSynthSupply())}
        </td>
        {/* apy */}
        <td className="bg-2">
          {formatFromUnits(synthApy, 2)}%
          <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apyVault')}>
            <span role="button">
              <Icon icon="info" size="17" className="me-1 mb-1" />
            </span>
          </OverlayTrigger>
        </td>
        {/* actions (buttons) */}
        <td className="bg-2">
          <Row className="text-center mt-2">
            <Button
              size="sm"
              variant="outline-secondary"
              className="w-100 mb-2"
              disabled={!asset.curated}
              onClick={() => history.push('/vaults?tab=Synth')}
            >
              {t('stake')}
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              className="w-100 mb-2"
              onClick={() => history.push(`/synths?asset2=${tokenAddress}`)}
            >
              {t('forge')}
            </Button>
          </Row>
        </td>
      </tr>
    </>
  )
}

export default SynthTableItem
