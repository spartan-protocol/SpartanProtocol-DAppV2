import { useWallet } from '@binance-chain/bsc-use-wallet'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col, Progress } from 'reactstrap'
import { useBond } from '../../../store/bond'
import {
  cancelProposal,
  finaliseProposal,
  removeVote,
  voteProposal,
} from '../../../store/dao/actions'
import { useDao } from '../../../store/dao/selector'
import { usePool } from '../../../store/pool/selector'
import { useSparta } from '../../../store/sparta/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { getExplorerContract, getExplorerWallet } from '../../../utils/extCalls'
import { formatShortString } from '../../../utils/web3'
import { proposalTypes } from './types'

const ProposalItem = ({ proposal }) => {
  const dao = useDao()
  const sparta = useSparta()
  const pool = usePool()
  const bond = useBond()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const type = proposalTypes.filter((i) => i.value === proposal.proposalType)[0]
  const cancelPeriod = BN('1209600')

  const getSecondsCancel = () => {
    const timeStamp = BN(Date.now()).div(1000)
    const secondsLeft = BN(proposal.startTime)
      .plus(cancelPeriod)
      .minus(timeStamp)
    if (secondsLeft > 86400) {
      return `in ${formatFromUnits(
        secondsLeft.div(60).div(60).div(24),
        2,
      )} days`
    }
    if (secondsLeft > 3600) {
      return `${formatFromUnits(secondsLeft.div(60).div(60), 2)} hours`
    }
    if (secondsLeft > 60) {
      return `in ${formatFromUnits(secondsLeft.div(60), 2)} minutes`
    }
    if (secondsLeft > 0) {
      return `in ${formatFromUnits(secondsLeft, 0)} seconds`
    }
    return 'right now'
  }

  const getSecondsCooloff = () => {
    const timeStamp = BN(Date.now()).div(1000)
    const endDate = BN(proposal.coolOffTime).plus(dao.global.coolOffPeriod)
    const secondsLeft = endDate.minus(timeStamp)
    if (secondsLeft > 86400) {
      return [formatFromUnits(secondsLeft.div(60).div(60).div(24), 2), ' days']
    }
    if (secondsLeft > 3600) {
      return [formatFromUnits(secondsLeft.div(60).div(60), 2), ' hours']
    }
    if (secondsLeft > 60) {
      return [formatFromUnits(secondsLeft.div(60), 2), ' minutes']
    }
    if (secondsLeft > 0) {
      return [formatFromUnits(secondsLeft, 0), ' seconds']
    }
    return [0, ' seconds']
  }

  const status = () => {
    if (proposal.open) {
      if (proposal.finalising && getSecondsCooloff()[0] > 0) {
        return `${
          getSecondsCooloff()[0] + getSecondsCooloff()[1]
        } cool-off remaining`
      }
      if (proposal.finalising && getSecondsCooloff()[0] <= 0) {
        return `Ready for final vote count!`
      }
      return 'Requires more support'
    }
    if (proposal.finalised) {
      return 'Successful Proposal'
    }
    return 'Failed Proposal'
  }

  const memberPercent = () => {
    if (dao.member.weight && bond.member.weight && proposal.memberVotes) {
      const _memberPercent = BN(proposal.memberVotes)
        .div(BN(dao.member.weight).plus(bond.member.weight))
        .times(100)
        .toString()
      if (_memberPercent > 0) {
        return _memberPercent
      }
    }
    return '0'
  }

  const totalPercent = () => {
    if (dao.global.totalWeight && bond.global.weight && proposal.votes) {
      const _totalPercent = BN(proposal.votes)
        .div(BN(dao.global.totalWeight).plus(bond.global.weight))
        .times(100)
        .toString()
      if (_totalPercent > 0) {
        return _totalPercent
      }
    }
    return '0'
  }

  const weightClass = () => {
    if (totalPercent() > (100 / 3) * 2) {
      return 'Majority'
    }
    if (totalPercent() > 100 / 2) {
      return 'Quorum'
    }
    if (totalPercent() > 100 / 6) {
      return 'Minority'
    }
    return 'Weak Support'
  }

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getPool = (tokenAddress) =>
    pool.poolDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const getDetails = () => {
    // 'GET_SPARTA' = '2.5M SPARTA'
    if (proposal.proposalType === 'GET_SPARTA') {
      return '2.5M SPARTA'
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
          </a>
          {getToken(proposal.proposedAddress)?.symbol}
        </>
      )
    }
    // 'FLIP_EMISSIONS' = 'on' or 'off'
    if (proposal.proposalType === 'FLIP_EMISSIONS') {
      return sparta.globalDetails.emitting ? 'off' : 'on'
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
          </a>
          {getToken(proposal.proposedAddress)?.symbol}p
        </>
      )
    }
    // 'COOL_OFF', 'ERAS_TO_EARN' = proposal.param + type.units
    if (['COOL_OFF', 'ERAS_TO_EARN'].includes(proposal.proposalType)) {
      return `${proposal.param} ${type.units}`
    }
    // 'GRANT' = proposal.param + 'to' + proposal.proposedAddress
    if (proposal.proposalType === 'GRANT') {
      return (
        <>
          {formatFromWei(proposal.param)} SPARTA to
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
    return '0'
  }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pt-3 pb-2 card-underlay">
          {/* {!proposal.open && (
            <Row className="mb-2">
              <Col xs="auto" className="pr-0 my-auto">
                <h4 className="my-auto">
                  {proposal.finalised
                    ? 'Ended Proposal - Success'
                    : 'Ended Proposal - Failed'}
                </h4>
              </Col>
            </Row>
          )} */}
          <Row className="mb-2">
            <Col xs="auto" className="pr-0 my-auto">
              <h4 className="my-auto">#{proposal.id}</h4>
            </Col>
            <Col>
              <h4 className="mb-0">{type?.label}</h4>
              <p className="text-sm-label-alt">{status()}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="output-card mb-2">{type?.desc}</div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="output-card mb-2">{getDetails()}</div>
            </Col>
          </Row>
          {proposal.open && (
            <>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  Can cancel
                </Col>
                <Col className="text-right output-card">
                  {getSecondsCancel()}
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  Your votes
                </Col>
                <Col className="text-right output-card">
                  {formatFromWei(proposal.memberVotes, 0)} (
                  {formatFromUnits(memberPercent(), 2)}%)
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  Total votes
                </Col>
                <Col className="text-right output-card">
                  {weightClass()} ({formatFromUnits(totalPercent(), 2)}%)
                </Col>
              </Row>

              <div className="progress-container progress-primary my-2">
                <span className="progress-badge" />
                <Progress max="100" value={totalPercent()} />
              </div>

              <Row>
                <Col className="px-1">
                  <Button
                    color="primary"
                    className="btn-sm w-100"
                    onClick={() => dispatch(voteProposal(wallet))}
                    disabled={memberPercent() >= 100}
                  >
                    Vote Up
                  </Button>
                </Col>
                <Col className="px-1">
                  <Button
                    color="primary"
                    className="btn-sm w-100"
                    onClick={() => dispatch(removeVote(wallet))}
                    disabled={memberPercent() <= 0}
                  >
                    Vote Down
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col className="px-1">
                  <Button
                    color="secondary"
                    className="btn-sm w-100"
                    onClick={() => dispatch(finaliseProposal(wallet))}
                    disabled={
                      !proposal.finalising || getSecondsCooloff()[0] > 0
                    }
                  >
                    Count Votes
                  </Button>
                </Col>
                <Col className="px-1">
                  <Button
                    color="secondary"
                    className="btn-sm w-100"
                    onClick={() => dispatch(cancelProposal(wallet))}
                    disabled={getSecondsCancel() !== 'right now'}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Col>
    </>
  )
}

export default ProposalItem
