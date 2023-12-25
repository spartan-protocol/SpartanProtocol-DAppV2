import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useTranslation } from 'react-i18next'
import { useAccount, useSigner } from 'wagmi'
import { useBond } from '../../store/bond'
import {
  useDao,
  cancelProposal,
  finaliseProposal,
  pollVotes,
  removeVote,
  voteProposal,
} from '../../store/dao'
import { usePool } from '../../store/pool'
import { useApp } from '../../store/app'
import { useSparta } from '../../store/sparta'
import { BN, formatFromUnits, formatFromWei } from '../../utils/bigNumber'
import { getExplorerContract, getExplorerWallet } from '../../utils/extCalls'
import { formatShortString } from '../../utils/web3'
import { proposalTypes } from './types'
import {
  formatDate,
  getTimeUntil,
  getVaultWeights,
} from '../../utils/math/nonContract'
import { Icon } from '../../components/Icons/index'
import { useSynth } from '../../store/synth'
import { realise } from '../../utils/math/synth'

const ProposalItem = ({ proposal }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { addresses } = useApp()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const sparta = useSparta()
  const synth = useSynth()

  const type = proposalTypes.filter((i) => i.value === proposal.proposalType)[0]

  const [voteLoading, setVoteLoading] = useState(false)
  const [unvoteLoading, setUnvoteLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [pollLoading, setPollLoading] = useState(false)
  const [finalLoading, setFinalLoading] = useState(false)

  const handleVote = async () => {
    setVoteLoading(true)
    await dispatch(voteProposal(signer))
    setVoteLoading(false)
  }

  const handleUnvote = async () => {
    setUnvoteLoading(true)
    await dispatch(removeVote(signer))
    setUnvoteLoading(false)
  }

  const handleCancel = async () => {
    setCancelLoading(true)
    await dispatch(cancelProposal(signer))
    setCancelLoading(false)
  }

  const handlePoll = async () => {
    setPollLoading(true)
    await dispatch(pollVotes(signer))
    setPollLoading(false)
  }

  const handleFinal = async () => {
    setFinalLoading(true)
    await dispatch(finaliseProposal(signer))
    setFinalLoading(false)
  }

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getPool = (tokenAddress) =>
    pool.poolDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const estMaxGasVote = '750000000000000' // 0.001 || 0.00075
  const estMaxGasPoll = '1000000000000000' // 0.002 || 0.001
  const estMaxGasCancel = '150000000000000' // 0.00025 || 0.00015
  const estMaxGasFinal = '5000000000000000' // 0.005 || 0.005
  const enoughGas = (maxGasAmnt) => {
    const bal = getToken(addresses.bnb).balance
    if (BN(bal).isLessThan(maxGasAmnt)) {
      return false
    }
    return true
  }

  const isLoading = () => {
    if (
      pool.poolDetails.length > 0 &&
      dao.daoDetails.length > 0 &&
      bond.bondDetails.length > 0 &&
      dao.totalWeight &&
      bond.totalWeight
    ) {
      return false
    }
    return true
  }

  const getTimeCancel = () => {
    const timeStamp = BN(proposal.startTime).plus(dao.global.cancelPeriod)
    return getTimeUntil(timeStamp, t)
  }

  const getTimeCooloff = () => {
    const timeStamp = BN(proposal.coolOffTime).plus(dao.global.coolOffPeriod)
    return getTimeUntil(timeStamp, t)
  }

  const totalPercent = () => {
    if (dao.totalWeight && bond.totalWeight) {
      const _totalPercent = BN(dao.proposalWeight)
        .div(BN(dao.totalWeight).plus(bond.totalWeight))
        .times(100)
        .toString()
      if (_totalPercent > 0) {
        return _totalPercent
      }
    }
    return '0'
  }

  const majorities = [
    'DAO',
    'UTILS',
    'RESERVE',
    'GET_SPARTA',
    'ROUTER',
    'LIST_BOND',
    'GRANT',
    'ADD_CURATED_POOL',
  ]

  const weightClass = () => {
    if (isLoading()) {
      return ['Loading...', 0]
    }
    if (totalPercent() > (100 / 3) * 2) {
      return [t('majority'), 3]
    }
    if (totalPercent() > 100 / 2) {
      return [t('quorum'), 2]
    }
    if (totalPercent() > 100 / 6) {
      return [t('minority'), 1]
    }
    return [t('weakSupport'), 0]
  }

  const canPoll = () => {
    if (majorities.includes(proposal.proposalType) && weightClass()[1] > 2) {
      return true
    }
    if (!majorities.includes(proposal.proposalType) && weightClass()[1] > 1) {
      return true
    }
    return false
  }

  const status = () => {
    if (proposal.open) {
      if (proposal.finalising && getTimeCooloff()[0] > 0) {
        return `${getTimeCooloff()[0] + getTimeCooloff()[1]} ${t(
          'coolOffRemaining',
        )}`
      }
      if (proposal.finalising && getTimeCooloff()[0] <= 0) {
        return t('readyFinalVoteCount')
      }
      if (canPoll()) {
        return t('readyToPollVotes')
      }
      return t('requiresMoreSupport')
    }
    if (proposal.finalised) {
      return t('successfulProposal')
    }
    return t('failedProposal')
  }

  const getDetails = () => {
    // 'GET_SPARTA' = '2.5M SPARTA'
    if (proposal.proposalType === 'GET_SPARTA') {
      return '2M SPARTA'
    }
    // 'LIST_BOND', 'DELIST_BOND' = proposal.proposedAddress + 'token details'
    if (['LIST_BOND', 'DELIST_BOND'].includes(proposal.proposalType)) {
      return (
        <>
          <a
            href={getExplorerContract(proposal.proposedAddress)}
            target="_blank"
            rel="noreferrer"
            className="mr-2"
          >
            {formatShortString(proposal.proposedAddress)}
          </a>{' '}
          {getToken(proposal.proposedAddress)?.symbol}
        </>
      )
    }
    // 'FLIP_EMISSIONS' = 'on' or 'off'
    if (proposal.proposalType === 'FLIP_EMISSIONS') {
      return proposal.open
        ? sparta.globalDetails.emitting
          ? 'off'
          : 'on'
        : 'Flipped'
    }
    // 'ADD_CURATED_POOL', 'REMOVE_CURATED_POOL' = proposal.proposedAddress + 'pool details'
    if (
      ['ADD_CURATED_POOL', 'REMOVE_CURATED_POOL'].includes(
        proposal.proposalType,
      )
    ) {
      return (
        <>
          <a
            href={getExplorerContract(
              getPool(proposal.proposedAddress)?.address,
            )}
            target="_blank"
            rel="noreferrer"
            className="mr-2"
          >
            {formatShortString(getPool(proposal.proposedAddress)?.address)}
          </a>{' '}
          {getToken(proposal.proposedAddress)?.symbol}p
        </>
      )
    }
    // 'COOL_OFF' = proposal.param + type.units
    if (
      ['COOL_OFF', 'DAO_CLAIM', 'SYNTH_CLAIM'].includes(proposal.proposalType)
    ) {
      return `${formatFromUnits(proposal.param)} ${type.units} ${
        ['DAO_CLAIM', 'SYNTH_CLAIM'].includes(proposal.proposalType)
          ? `(${proposal.param / 100}%)`
          : ''
      }`
    }
    // 'GRANT' = proposal.param + 'to' + proposal.proposedAddress
    if (proposal.proposalType === 'GRANT') {
      return (
        <>
          {formatFromWei(proposal.param, 0)} SPARTA to{' '}
          <a
            href={getExplorerWallet(proposal.proposedAddress)}
            target="_blank"
            rel="noreferrer"
            className="ml-2"
          >
            {formatShortString(proposal.proposedAddress)}
          </a>
        </>
      )
    }
    // 'DAO', 'ROUTER', 'UTILS', 'RESERVE' = proposal.proposedAddress
    if (['DAO', 'ROUTER', 'UTILS', 'RESERVE'].includes(proposal.proposalType)) {
      return (
        <>
          <a
            href={getExplorerContract(proposal.proposedAddress)}
            target="_blank"
            rel="noreferrer"
            className="mr-2"
          >
            {formatShortString(proposal.proposedAddress)}
          </a>
        </>
      )
    }
    if (['REALISE'].includes(proposal.proposalType)) {
      const _synth = synth.synthDetails.filter(
        (x) => x.address === proposal.proposedAddress,
      )[0]
      const _pool = pool.poolDetails.filter(
        (x) => x.tokenAddress === _synth.tokenAddress,
      )[0]
      return (
        <>
          {proposal.open &&
            `${formatFromWei(realise(_synth, _pool)[0])} ${
              getToken(_synth.tokenAddress).symbol
            }p = ${formatFromWei(realise(_synth, _pool)[1])} SPARTA`}
        </>
      )
    }
    return '0'
  }

  return (
    <>
      <Col xs="12" sm="6" lg="4" className="mb-3">
        <Card style={{ minHeight: '285px' }}>
          <Card.Header>
            <Row className="h-100">
              <Col>
                <h4 className="mb-0">{t(type?.label)}</h4>
                <Card.Subtitle>
                  (#{proposal.id}) {status()}
                </Card.Subtitle>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="pb-0">
            <Row>
              <Col>
                <div className="mb-2">{t(type?.desc)}:</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="mb-2">
                  {synth.synthDetails.length > 0 && getDetails()}
                </div>
              </Col>
            </Row>
            {proposal.open ? (
              <>
                <Row className="my-1">
                  <Col xs="auto">{t('canCancel')}</Col>
                  <Col className="text-end">
                    {getTimeCancel()[0] > 0
                      ? getTimeCancel()[0] + getTimeCancel()[1]
                      : t('rightNow')}
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto">{t('yourVotes')}</Col>
                  <Col className="text-end">
                    {!address ? (
                      t('connectWallet')
                    ) : proposal.memberVoted ? (
                      <>
                        {formatFromWei(
                          getVaultWeights(
                            pool.poolDetails,
                            dao.daoDetails,
                            bond.bondDetails,
                          ),
                          0,
                        )}
                        <Icon icon="spartav2" size="17" className="mb-1 ms-1" />
                      </>
                    ) : (
                      t('youHaventVoted')
                    )}{' '}
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto">{t('totalVotes')}</Col>
                  <Col className="text-end">
                    {weightClass()[0]} ({formatFromUnits(totalPercent(), 2)}%)
                  </Col>
                </Row>

                <div className="progress-container progress-primary mt-2">
                  <span className="progress-badge" />
                  <ProgressBar now={totalPercent()} />
                </div>
              </>
            ) : (
              <Row>
                <Col>
                  <small className="mb-2">{t(type?.longDesc)}</small>
                </Col>
              </Row>
            )}
          </Card.Body>
          <Card.Footer>
            {proposal.open ? (
              <>
                <Row>
                  {!proposal.memberVoted && (
                    <Col className="mb-3">
                      <Button
                        className="w-100"
                        size="sm"
                        onClick={() => handleVote()}
                        disabled={
                          !address ||
                          proposal.memberVoted ||
                          !enoughGas(estMaxGasVote)
                        }
                      >
                        {!enoughGas(estMaxGasVote)
                          ? t('checkBnbGas')
                          : sparta.globalDetails.globalFreeze
                          ? t('globalFreeze')
                          : t('addVote')}
                        {voteLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                            fill="white"
                          />
                        )}
                      </Button>
                    </Col>
                  )}
                  {proposal.memberVoted && (
                    <Col className="mb-2">
                      <Button
                        className="w-100"
                        size="sm"
                        onClick={() => handleUnvote()}
                        disabled={
                          !address ||
                          !proposal.memberVoted ||
                          !enoughGas(estMaxGasVote)
                        }
                      >
                        {!enoughGas(estMaxGasVote)
                          ? t('checkBnbGas')
                          : t('removeVote')}
                        {unvoteLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                            fill="white"
                          />
                        )}
                      </Button>
                    </Col>
                  )}
                </Row>

                <Row>
                  <Col className="pe-1">
                    {proposal.finalising ? (
                      <Button
                        className="w-100"
                        size="sm"
                        onClick={() => handleFinal()}
                        disabled={
                          !address ||
                          !proposal.finalising ||
                          getTimeCooloff()[0] > 0 ||
                          !enoughGas(estMaxGasFinal)
                        }
                      >
                        {!enoughGas(estMaxGasFinal)
                          ? t('checkBnbGas')
                          : sparta.globalDetails.globalFreeze
                          ? t('globalFreeze')
                          : t('finalise')}
                        {finalLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                            fill="white"
                          />
                        )}
                      </Button>
                    ) : (
                      <Button
                        className="w-100"
                        size="sm"
                        onClick={() => handlePoll()}
                        disabled={
                          !address || !canPoll() || !enoughGas(estMaxGasPoll)
                        }
                      >
                        {!enoughGas(estMaxGasPoll)
                          ? t('checkBnbGas')
                          : t('pollVotes')}
                        {pollLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                            fill="white"
                          />
                        )}
                      </Button>
                    )}
                  </Col>
                  <Col className="ps-1">
                    <Button
                      className="w-100"
                      size="sm"
                      onClick={() => handleCancel()}
                      disabled={
                        !address ||
                        getTimeCancel()[0] > 0 ||
                        !enoughGas(estMaxGasCancel)
                      }
                    >
                      {!enoughGas(estMaxGasCancel)
                        ? t('checkBnbGas')
                        : t('cancel')}
                      {cancelLoading && (
                        <Icon
                          icon="cycle"
                          size="20"
                          className="anim-spin ms-1"
                          fill="white"
                        />
                      )}
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <Row>
                <Col>
                  {t('proposedOn')} {formatDate(proposal.startTime)}
                </Col>
              </Row>
            )}
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default ProposalItem
