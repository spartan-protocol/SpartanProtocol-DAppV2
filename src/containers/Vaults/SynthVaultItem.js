import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { formatFromWei } from '../../utils/bigNumber'
import { useSynth } from '../../store/synth'
import { useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import spartaIconAlt from '../../assets/tokens/sparta-synth.svg'
import SynthDepositModal from './Components/SynthDepositModal'
import SynthWithdrawModal from './Components/SynthWithdrawModal'
import { Icon } from '../../components/Icons/index'
import { getTimeSince } from '../../utils/math/nonContract'
import { calcCurrentRewardSynth } from '../../utils/math/synthVault'
import SynthHarvestModal from './Components/SynthHarvestModal'

const SynthVaultItem = ({ synthItem }) => {
  const { t } = useTranslation()
  const sparta = useSparta()
  const reserve = useReserve()
  const synth = useSynth()
  const pool = usePool()
  const wallet = useWeb3React()

  const getToken = (_tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddress)[0]

  // Calculations
  const getClaimable = () => {
    const [synthOut, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      synthItem,
      sparta.globalDetails,
      reserve.globalDetails.spartaBalance,
    )
    return [synthOut, baseCapped, synthCapped]
  }

  const checkValid = () => {
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled')]
    }
    if (getClaimable()[1]) {
      return [false, t('poolAtCapacity')]
    }
    return [true, t('harvest')]
  }

  const getHarvestable = () => {
    const valid = checkValid()[0]
    const reward = formatFromWei(getClaimable()[0], 4)
    if (getClaimable()[2]) {
      return [valid, reward, ' SPARTA']
    }
    return [valid, reward, ` ${getToken(synthItem.tokenAddress)?.symbol}s`]
  }

  return (
    <>
      <Col xs="auto">
        <Card className="card-320" style={{ minHeight: '255' }}>
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
                <img
                  className="mr-3 rounded-circle"
                  src={getToken(synthItem.tokenAddress)?.symbolUrl}
                  alt={getToken(synthItem.tokenAddress)?.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIconAlt}
                  alt="Sparta synth token icon"
                  className="position-absolute"
                  style={{ right: '8px', bottom: '7px' }}
                />
              </Col>
              <Col xs="auto" className="pl-1">
                <h3 className="mb-0">
                  {getToken(synthItem.tokenAddress)?.symbol}s
                </h3>
                <Link to={`/synths?asset2=${synthItem.tokenAddress}`}>
                  <p className="text-sm-label-alt">
                    {t('obtain')} {getToken(synthItem.tokenAddress)?.symbol}s
                    <Icon icon="scan" size="13" className="ms-1" />
                  </p>
                </Link>
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('balance')}
              </Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>
                    {formatFromWei(synthItem.balance)}{' '}
                    {getToken(synthItem.tokenAddress)?.symbol}s
                  </>
                )}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('staked')}
              </Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>
                    {formatFromWei(synthItem.staked)}{' '}
                    {getToken(synthItem.tokenAddress)?.symbol}s
                  </>
                )}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('harvestable')}
              </Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>{getHarvestable()[1] + getHarvestable()[2]}</>
                )}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lastHarvest')}
              </Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>
                    {synthItem.lastHarvest > 0
                      ? `${
                          getTimeSince(synthItem.lastHarvest, t)[0] +
                          getTimeSince(synthItem.lastHarvest, t)[1]
                        } ${t('ago')}`
                      : t('never')}
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="">
            <Row>
              <Col xs="6" className="pe-1">
                <SynthDepositModal
                  tokenAddress={synthItem.tokenAddress}
                  disabled={synthItem.balance <= 0}
                />
              </Col>
              <Col xs="6" className="ps-1">
                <SynthWithdrawModal
                  synthItem={synthItem}
                  disabled={synthItem.staked <= 0}
                  claimable={getHarvestable()}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs="12" className="">
                <SynthHarvestModal
                  synthItem={synthItem}
                  buttonValid={checkValid()}
                />
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default SynthVaultItem
