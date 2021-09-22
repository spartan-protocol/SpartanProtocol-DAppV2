import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Modal, Row, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../../store/pool'
import { BN, formatFromWei } from '../../../../utils/bigNumber'
import Approval from '../../../../components/Approval/Approval'
import { getAddresses } from '../../../../utils/web3'
import { synthDeposit } from '../../../../store/synth/actions'
import { useSynth } from '../../../../store/synth/selector'
import { Icon } from '../../../../components/Icons/icons'

const SynthDepositModal = ({ showModal, toggleModal, tokenAddress }) => {
  const [percentage, setpercentage] = useState('0')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const synth = useSynth()
  const wallet = useWeb3React()
  const addr = getAddresses()

  const [txnLoading, setTxnLoading] = useState(false)

  const synth1 = synth.synthDetails.filter(
    (i) => i.tokenAddress === tokenAddress,
  )[0]
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const deposit = () => BN(percentage).div(100).times(synth1.balance).toFixed(0)

  const handleCloseModal = () => {
    toggleModal()
    setpercentage('0')
  }

  const handleDeposit = async () => {
    setTxnLoading(true)
    await dispatch(synthDeposit(synth1.address, deposit(), wallet))
    setTxnLoading(false)
  }

  return (
    <Modal show={showModal} onHide={() => handleCloseModal()} centered>
      <Modal.Header>{t('deposit')}</Modal.Header>
      <Card className="">
        <Card.Body>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('amount')}
            </Col>
            <Col className="text-right output-card">
              {formatFromWei(deposit())} {token.symbol}s
            </Col>
          </Row>
          <Row className="">
            <Col xs="12">
              <Form.Range
                id="daoVaultSlider"
                onChange={(e) => setpercentage(e.target.value)}
                min="0"
                max="100"
                defaultValue="0"
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
            {wallet?.account && (
              <Approval
                tokenAddress={synth1.address}
                symbol={`${token.symbol}s`}
                walletAddress={wallet?.account}
                contractAddress={addr.synthVault}
                txnAmount={deposit()}
                assetNumber="1"
              />
            )}
            <Col className="hide-if-prior-sibling">
              <Button className="w-100" onClick={() => handleDeposit()}>
                {t('confirm')}
                {txnLoading && (
                  <Icon icon="cycle" size="20" className="anim-spin ms-1" />
                )}
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Modal>
  )
}

export default SynthDepositModal
