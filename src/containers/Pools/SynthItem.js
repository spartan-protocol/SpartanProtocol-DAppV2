import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool'
import { synthVaultWeight, useSynth } from '../../store/synth'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatFromWei,
  formatShortNumber,
} from '../../utils/bigNumber'
import { Icon } from '../../components/Icons/index'
import spartaIconAlt from '../../assets/tokens/sparta-synth.svg'
import { Tooltip } from '../../components/Tooltip/index'
import { calcLiqValue, getSynth } from '../../utils/math/utils'
import { stirCauldron } from '../../utils/math/router'

const SynthItem = ({ asset, synthApy }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const synth = useSynth()
  const history = useHistory()
  const web3 = useWeb3()
  const isLightMode = window.localStorage.getItem('theme')
  const { tokenAddress, baseAmount, tokenAmount, newPool, curated } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)

  const synthCapTooltip = Tooltip(t, 'synthCap')
  const synthPCTooltip = Tooltip(t, 'synthPC')
  const synthURTooltip = Tooltip(t, 'synthUR')

  const _getSynth = () => getSynth(tokenAddress, synth.synthDetails)
  // const getSynthCap = () => BN(tokenAmount).times(asset.synthCapBPs).div(10000)
  const getSynthSupply = () => _getSynth().totalSupply
  const getSynthDepthPC = () => BN(getSynthSupply()).div(tokenAmount).times(100)
  const getSynthCollat = () => calcLiqValue(_getSynth().lpBalance, asset)
  const getSynthCollatToken = () =>
    BN(getSynthCollat()[1]).times(2).minus(getSynthSupply())
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
      <Col xs="auto">
        <Card className="card-320 pb-2 card-alt" style={{ minHeight: '310px' }}>
          <Card.Header>
            <h6 className="mb-0 text-center">
              {newPool && (
                <Badge bg="dark" className="p-1 me-1">
                  {t('new')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'newPool', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {curated && (
                <Badge bg="dark" className="p-1 me-1">
                  {t('curated')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolCurated', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {!curated && (
                <Badge bg="dark" className="p-1 me-1">
                  {t('normal')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolNormal', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {!asset.frozen && (
                <Badge bg="success" className="p-1">
                  {t('active')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolActive', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {asset.frozen && (
                <Badge bg="danger" className="p-1">
                  {t('inactive')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolInactive', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
            </h6>
          </Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
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
                  style={{ right: '8px', bottom: '10px' }}
                />
              </Col>
              <Col xs="auto" className="pe-0 my-auto">
                <h3 className="mb-0">{token.symbol}</h3>
                <p className="text-sm-label-alt">
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(
                      t,
                      `$${formatFromUnits(tokenValueUSD, 18)}`,
                    )}
                  >
                    <span role="button">
                      ${formatFromUnits(tokenValueUSD, 2)}
                    </span>
                  </OverlayTrigger>
                </p>
              </Col>
              <Col className="text-end my-auto">
                <p className="text-sm-label mb-0 d-inline-block">Synth APY</p>
                <p className="output-card">
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'apySynth')}
                  >
                    <span role="button">
                      <Icon
                        icon="lock"
                        size="17"
                        fill={isLightMode ? 'black' : 'white'}
                        className="me-1 mb-1"
                      />
                    </span>
                  </OverlayTrigger>
                  {formatFromUnits(synthApy, 2)}%
                </p>
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card pe-0">
                {t('softCap')}
                <OverlayTrigger placement="auto" overlay={synthCapTooltip}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end output-card my-auto">
                <Row>
                  <Col xs="auto">
                    {formatShortNumber(convertFromWei(getSynthSupply()))}
                  </Col>
                  <Col className="my-auto px-0">
                    <ProgressBar style={{ height: '5px' }} className="">
                      <ProgressBar
                        variant={getSynthCapPC() > 95 ? 'primary' : 'success'}
                        key={1}
                        now={getSynthCapPC()}
                      />
                    </ProgressBar>
                  </Col>
                  <Col xs="auto">
                    {formatShortNumber(
                      convertFromWei(BN(getSynthSupply()).plus(getSynthStir())),
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('tokenDepth')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(tokenAmount)}
                <img
                  src={token.symbolUrl}
                  className="rounded-circle ps-1"
                  alt={token.symbol}
                  height="18"
                />
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('synthSupply')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(getSynthSupply())}
                <img
                  src={token.symbolUrl}
                  className="rounded-circle ps-1"
                  alt={token.symbol}
                  height="18"
                />
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('synthPC')}
                <OverlayTrigger placement="auto" overlay={synthPCTooltip}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end output-card">
                {formatFromUnits(getSynthDepthPC(), 2)}%
                <img
                  src={token.symbolUrl}
                  className="rounded-circle ps-1"
                  alt={token.symbol}
                  height="18"
                />
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('unrealised')}
                <OverlayTrigger placement="auto" overlay={synthURTooltip}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(getSynthCollatToken())}
                <img
                  src={token.symbolUrl}
                  className="rounded-circle ps-1"
                  alt={token.symbol}
                  height="18"
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row className="text-center mt-2">
              <Col>
                <Button
                  size="sm"
                  variant="info"
                  className="w-100 rounded-pill"
                  disabled={!asset.curated}
                  onClick={() => history.push('/vaults?tab=Synth')}
                >
                  {t('stake')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="sm"
                  variant="info"
                  className="w-100 rounded-pill"
                  onClick={() => history.push(`/synths?asset2=${tokenAddress}`)}
                >
                  {t('forge')}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default SynthItem
