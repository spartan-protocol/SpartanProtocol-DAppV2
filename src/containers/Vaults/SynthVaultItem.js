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
import { useSparta } from '../../store/sparta'
import spartaIconAlt from '../../assets/tokens/sparta-synth.svg'
// import SynthDepositModal from './Components/SynthDepositModal'
import SynthWithdrawModal from './Components/SynthWithdrawModal'
import { Icon } from '../../components/Icons/index'
import { calcCurrentRewardSynth } from '../../utils/math/synthVault'
// import SynthHarvestModal from './Components/SynthHarvestModal'

const SynthVaultItem = ({ synthItem }) => {
  const { t } = useTranslation()
  const sparta = useSparta()
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
      sparta.globalDetails.spartaBalance,
    )
    return [synthOut, baseCapped, synthCapped]
  }

  const checkValid = () => {
    if (!sparta.globalDetails.emissions) {
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
      <Col className="mb-4" xs="12" sm="6" lg="4">
        <Card style={{ minHeight: '265px' }}>
          <Card.Header>
            <Row className="mb-1">
              <Col xs="auto" className="position-relative pt-1">
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
                  className="token-badge-pair"
                />
              </Col>
              <Col className="pl-1">
                <h3 className="mb-0">
                  {getToken(synthItem.tokenAddress)?.symbol}s
                </h3>
                <Link to={`/synths?asset2=${synthItem.tokenAddress}`}>
                  <small>
                    {t('obtain')} {getToken(synthItem.tokenAddress)?.symbol}s
                    <Icon icon="scan" size="11" className="ms-1" />
                  </small>
                </Link>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="my-1">
              <Col>{t('balance')}</Col>
              <Col xs="auto" className="text-end">
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
              <Col>{t('staked')}</Col>
              <Col xs="auto" className="text-end">
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
              <Col>{t('harvestable')}</Col>
              <Col xs="auto" className="text-end">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>{getHarvestable()[1] + getHarvestable()[2]}</>
                )}
              </Col>
            </Row>

            {/* <Row className="my-1">
              <Col>{t('lastHarvest')}</Col>
              <Col xs="auto" className="text-end">
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
            </Row> */}
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col xs="6" className="pe-1">
                {/* <SynthDepositModal
                  tokenAddress={synthItem.tokenAddress}
                  disabled={synthItem.balance <= 0}
                /> */}
              </Col>
              <Col xs="12" className="ps-1">
                <SynthWithdrawModal
                  synthItem={synthItem}
                  disabled={synthItem.staked <= 0}
                  claimable={getHarvestable()}
                />
              </Col>
            </Row>
            {/* <Row className="mt-2">
              <Col xs="12">
                <SynthHarvestModal
                  synthItem={synthItem}
                  buttonValid={checkValid()}
                />
              </Col>
            </Row> */}
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default SynthVaultItem
