import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { getAddresses, synthHarvestLive } from '../../../utils/web3'
import { useSynth, getSynthDetails, synthHarvest } from '../../../store/synth'
import { Icon } from '../../../components/Icons/index'
import { getSynth, getToken } from '../../../utils/math/utils'
import { useReserve } from '../../../store/reserve'
import { calcCurrentRewardSynth } from '../../../utils/math/synthVault'
import { useSparta } from '../../../store/sparta'
import { useWeb3 } from '../../../store/web3'
import { useTheme } from '../../../providers/Theme'

const SynthHarvestAllModal = () => {
  const dispatch = useDispatch()
  const pool = usePool()
  const reserve = useReserve()
  const sparta = useSparta()
  const synth = useSynth()
  const web3 = useWeb3()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const wallet = useWeb3React()
  const addr = getAddresses()

  const [txnLoading, setTxnLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)
  const [claimArray, setClaimArray] = useState([])
  const [finalClaimArray, setFinalClaimArray] = useState([])

  const handleCloseModal = () => {
    setshowModal(false)
    setLockoutConfirm(false)
  }

  const getArray = () => {
    const _array = []
    for (let i = 0; i < finalClaimArray.length; i++) {
      _array.push(finalClaimArray[i].address)
    }
    return _array
  }

  const handleHarvest = async () => {
    setTxnLoading(true)
    await dispatch(synthHarvest(getArray(), wallet, web3.rpcs))
    setTxnLoading(false)
    if (synth.synthArray?.length > 1) {
      dispatch(getSynthDetails(synth.synthArray, wallet, web3.rpcs))
    }
    handleCloseModal()
  }

  useEffect(() => {
    if (synth.synthDetails.length > 1) {
      const tempArray = []
      synth.synthDetails
        .filter((x) => x.staked > 0)
        .map((x) => tempArray.push(x.address))
      setClaimArray(tempArray)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.synthDetails])

  const _getSynth = (synthAddr) => getSynth(synthAddr, synth.synthDetails)
  const _getToken = (tokenAddr) => getToken(tokenAddr, pool.tokenDetails)

  const getClaimable = (_synth) => {
    const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      _synth,
      sparta.globalDetails,
      reserve.globalDetails.spartaBalance,
    )
    return [reward, baseCapped, synthCapped]
  }

  const checkValidHarvest = (baseCapped, synthCapped, symbol, reward) => {
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled'), '']
    }
    if (baseCapped) {
      return [false, t('baseCap'), '']
    }
    if (synthCapped) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${symbol}s`]
  }

  const getFinalArray = () => {
    const finalArray = []
    for (let i = 0; i < claimArray.length; i++) {
      const _synth = _getSynth(claimArray[i])
      const { symbol } = _getToken(_synth.tokenAddress)
      const claim = getClaimable(_synth)
      const valid = checkValidHarvest(claim[1], claim[2], symbol, claim[0])
      if (valid[0]) {
        finalArray.push({
          address: _synth.address,
          tokenAddress: _synth.tokenAddress,
          reward: valid[1],
          rewardString: valid[2],
          staked: _synth.staked,
          symbol,
        })
      }
    }
    return finalArray
  }
  useEffect(() => {
    if (claimArray) {
      setFinalClaimArray(getFinalArray())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimArray])

  // *CHECK === *CHECK
  const estMaxGas = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!synthHarvestLive) {
      return [false, t('harvestDisabled')]
    }
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled')]
    }
    // if (!synth.synthMinting) {
    //   return [false, t('synthsDisabled')]
    // }
    if (reserve.globalDetails.globalFreeze) {
      return [false, t('globalFreeze')]
    }
    if (synth.memberDetails?.totalWeight <= 0 || claimArray.length <= 0) {
      return [false, t('noClaim')]
    }
    if (!lockoutConfirm) {
      return [false, t('confirmLockup')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    return [true, t('harvestAll')]
  }

  return (
    <>
      <Button
        className="w-100 btn-sm"
        onClick={() => setshowModal(true)}
        disabled={!synthHarvestLive || synth.totalWeight <= 0}
      >
        {synthHarvestLive ? t('harvestAll') : t('harvestDisabled')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant={isDark ? 'white' : undefined}>
          {t('harvestAll')}
        </Modal.Header>
        <Card className="">
          <Card.Body>
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                This harvest will temporarily lock your whole SynthVault &
                disable withdraw on all staked SynthYield tokens for{' '}
                {synth.globalDetails.minTime} seconds:
              </Col>
            </Row>
            {synth.synthDetails
              .filter((x) => x.staked > 0)
              .map((x) => (
                <Row xs="12" key={x.address}>
                  <Col xs="auto" className="text-card">
                    Existing stake locked
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(x.staked)}{' '}
                    {getToken(x.tokenAddress, pool.tokenDetails).symbol}s
                  </Col>
                </Row>
              ))}
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                It is estimated that you will receive these Harvest rewards:
              </Col>
            </Row>
            {finalClaimArray.map((x) => (
              <Row xs="12" key={x.address}>
                <Col xs="auto" className="text-card">
                  {x.symbol}s Claim:
                </Col>
                <Col className="text-end output-card">
                  {formatFromWei(x.reward)} {x.rewardString}
                </Col>
              </Row>
            ))}
            <Form className="my-2 text-center">
              <span className="output-card">
                Confirm {synth.globalDetails.minTime} seconds withdraw lockout
                <Form.Check
                  type="switch"
                  id="confirmLockout"
                  className="ms-2 d-inline-flex"
                  checked={lockoutConfirm}
                  onChange={() => setLockoutConfirm(!lockoutConfirm)}
                />
              </span>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>
                <Button
                  className="w-100"
                  onClick={() => handleHarvest()}
                  disabled={!checkValid()[0]}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon
                      fill="white"
                      icon="cycle"
                      size="20"
                      className="anim-spin ms-1"
                    />
                  )}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal>
    </>
  )
}

export default SynthHarvestAllModal
