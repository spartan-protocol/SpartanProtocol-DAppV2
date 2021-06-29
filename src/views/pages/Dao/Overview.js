import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import ProposalItem from './ProposalItem'
import { useDao } from '../../../store/dao/selector'
import {
  daoGlobalDetails,
  daoMemberDetails,
  daoProposalDetails,
} from '../../../store/dao/actions'
import NewProposal from './NewProposal'
import { bondMemberDetails } from '../../../store/bond'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'

const Overview = () => {
  const dispatch = useDispatch()
  const dao = useDao()
  const wallet = useWallet()
  const { t } = useTranslation()

  const [selectedView, setSelectedView] = useState('current')

  const [network, setnetwork] = useState(getNetwork())
  const [trigger1, settrigger1] = useState(0)
  const getData1 = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger1 === 0) {
      getData1()
    }
    const timer = setTimeout(() => {
      getData1()
      settrigger1(trigger1 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    if (network.chainId === 97) {
      dispatch(daoGlobalDetails(wallet))
    }
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    if (network.chainId === 97) {
      dispatch(daoMemberDetails(wallet))
      dispatch(bondMemberDetails(wallet))
      dispatch(daoProposalDetails(dao.global?.proposalCount, wallet))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.global, dao.newProp])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 me-3">{t('dao')}</h2>
              <NewProposal />
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Form.Group as={Row} className="row-480 mb-3">
              <Col xs="12">
                <Form.Check
                  label="Current Proposal"
                  inline
                  name="group1"
                  type="radio"
                  id="viewCurrent"
                  defaultChecked
                  onClick={() => setSelectedView('current')}
                />
                <Form.Check
                  label="Completed Proposals"
                  inline
                  name="group1"
                  type="radio"
                  id="viewComplete"
                  onClick={() => setSelectedView('complete')}
                />
                <Form.Check
                  label="Failed Proposals"
                  inline
                  name="group1"
                  type="radio"
                  id="viewFailed"
                  onClick={() => setSelectedView('failed')}
                />
              </Col>
            </Form.Group>
            <Row className="row-480">
              {dao?.proposal.length > 0 && (
                <>
                  {selectedView === 'current' &&
                    (dao?.proposal.filter((pid) => pid.open).length > 0
                      ? dao?.proposal
                          .filter((pid) => pid.open)
                          .map((pid) => (
                            <ProposalItem key={pid.id} proposal={pid} />
                          ))
                      : 'No open proposals, visit the community channels to join the discussion of the next community proposal')}
                  {selectedView === 'complete' &&
                    dao?.proposal
                      .filter((pid) => pid.finalised)
                      .sort((a, b) => b.id - a.id)
                      .map((pid) => (
                        <ProposalItem key={pid.id} proposal={pid} />
                      ))}
                  {selectedView === 'failed' &&
                    dao?.proposal
                      .filter((pid) => !pid.open && !pid.finalised)
                      .sort((a, b) => b.id - a.id)
                      .map((pid) => (
                        <ProposalItem key={pid.id} proposal={pid} />
                      ))}
                </>
              )}

              {dao?.proposal.length <= 0 && (
                <Col xs="auto">
                  <Card className="card-320 card-underlay">
                    <Card.Title>No valid proposals found</Card.Title>
                  </Card>
                </Col>
              )}
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
