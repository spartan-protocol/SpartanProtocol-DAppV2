/* eslint-disable no-unused-vars */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col, Progress } from 'reactstrap'
import { useBond } from '../../../store/bond'
import {
  finaliseProposal,
  removeVote,
  voteProposal,
} from '../../../store/dao/actions'
import { useDao } from '../../../store/dao/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { proposalTypes } from './types'
// import downIcon from '../../../assets/icons/arrow-down-light.svg'
// import upIcon from '../../../assets/icons/arrow-up-light.svg'

const ProposalItem = ({ proposal }) => {
  const dao = useDao()
  const bond = useBond()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const type = proposalTypes.filter((i) => i.value === proposal.proposalType)[0]
  const getEndDate = () => {
    const timeStamp = BN(Date.now()).div(1000)
    const endDate = BN(proposal.timeStart).plus(dao.global.coolOffPeriod)
    const hoursAway = timeStamp.minus(endDate).div(60).div(60)
    return hoursAway.toFixed(0)
  }
  const status =
    proposal.finalising && getEndDate() > 0
      ? `Finalising in ${getEndDate()} Hrs`
      : 'Requires More Support'

  const memberPercent =
    dao.member.weight && bond.member.weight
      ? BN(proposal.memberVotes)
          .div(BN(dao.member.weight).plus(bond.member.weight))
          .times(100)
          .toString()
      : '0'

  const totalPercent =
    dao.global.totalWeight && bond.global.weight
      ? BN(proposal.votes)
          .div(BN(dao.global.totalWeight).plus(bond.global.weight))
          .times(100)
          .toString()
      : '0'

  const weightClass = () => {
    if (totalPercent > (100 / 3) * 2) {
      return 'Majority'
    }
    if (totalPercent > 100 / 2) {
      return 'Quorum'
    }
    if (totalPercent > 100 / 6) {
      return 'Minority'
    }
    return 'Weak Support'
  }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pt-3 pb-2 card-underlay">
          <Row className="mb-2">
            <Col xs="auto" className="pr-0 my-auto">
              <h4 className="my-auto">{proposal.id}</h4>
            </Col>
            <Col>
              <h3 className="mb-0">{type.label}</h3>
              <p className="text-sm-label-alt">{status}</p>
            </Col>
            {/* <Col xs="auto" className="text-right my-auto">
              <img
                onClick={() => toggleCollapse()}
                src={showDetails ? upIcon : downIcon}
                alt={showDetails ? 'upIcon' : 'downIcon'}
                className="swap-icon-color"
                aria-hidden="true"
                style={{
                  cursor: 'pointer',
                  height: '30px',
                  width: '30px',
                  top: '-15px',
                }}
              />
            </Col> */}
          </Row>
          <Row>
            <Col>
              <div className="output-card mb-2">{type.desc}</div>
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              Your votes
            </Col>
            <Col className="text-right output-card">
              {formatFromWei(proposal.memberVotes)} (
              {formatFromUnits(memberPercent, 2)}%)
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              Total votes
            </Col>
            <Col className="text-right output-card">
              {weightClass()} ({formatFromUnits(totalPercent, 2)}%)
            </Col>
          </Row>

          <div className="progress-container progress-primary my-2">
            <span className="progress-badge" />
            <Progress max="100" value={totalPercent} />
          </div>

          <Row>
            <Col className="px-1">
              <Button
                color="primary"
                className="btn-sm w-100"
                onClick={() => dispatch(voteProposal(proposal.id, wallet))}
                disabled={memberPercent >= 100}
              >
                Vote Up
              </Button>
            </Col>
            <Col className="px-1">
              <Button
                color="primary"
                className="btn-sm w-100"
                onClick={() => dispatch(removeVote(proposal.id, wallet))}
                disabled={memberPercent <= 0}
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
                onClick={() => dispatch(finaliseProposal(proposal.id, wallet))}
                disabled={!proposal.finalising || getEndDate() > 0}
              >
                Count Votes
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default ProposalItem
