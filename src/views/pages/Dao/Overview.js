import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import ProposalItem from './ProposalItem'
import { useDao } from '../../../store/dao/selector'
import {
  daoGlobalDetails,
  daoMemberDetails,
  daoProposalDetails,
  daoVaultWeight,
  getDaoDetails,
  proposalWeight,
} from '../../../store/dao/actions'
import NewProposal from './NewProposal'
import { getNetwork, tempChains } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool/selector'
import { bondVaultWeight, getBondDetails } from '../../../store/bond'
import { getSynthDetails } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Overview = () => {
  const dispatch = useDispatch()
  const dao = useDao()
  const pool = usePool()
  const synth = useSynth()
  const wallet = useWeb3React()
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
    if (tempChains.includes(network.chainId)) {
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
    if (tempChains.includes(network.chainId)) {
      dispatch(daoMemberDetails(wallet))
      dispatch(daoProposalDetails(dao.global?.currentProposal, wallet))
      dispatch(
        proposalWeight(dao.global?.currentProposal, pool.poolDetails, wallet),
      )
      dispatch(daoVaultWeight(pool.poolDetails, wallet))
      dispatch(bondVaultWeight(pool.poolDetails, wallet))
      dispatch(getDaoDetails(pool.listedPools, wallet))
      dispatch(getBondDetails(pool.listedPools, wallet))
      dispatch(getSynthDetails(synth.synthArray, wallet))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.global, dao.newProp])

  const isLoading = () => {
    if (!dao.proposal) {
      return true
    }
    return false
  }

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
        {tempChains.includes(network.chainId) && (
          <>
            <Form.Group as={Row} className="row-480 mb-3">
              <Col xs="12">
                <Form.Check
                  label={t('open')}
                  inline
                  name="group1"
                  type="radio"
                  id="viewCurrent"
                  defaultChecked
                  onClick={() => setSelectedView('current')}
                />
                <Form.Check
                  label={t('completed')}
                  inline
                  name="group1"
                  type="radio"
                  id="viewComplete"
                  onClick={() => setSelectedView('complete')}
                />
                <Form.Check
                  label={t('failed')}
                  inline
                  name="group1"
                  type="radio"
                  id="viewFailed"
                  onClick={() => setSelectedView('failed')}
                />
              </Col>
            </Form.Group>
            {!isLoading() ? (
              <Row className="row-480">
                {dao.proposal.length > 0 ? (
                  <>
                    {selectedView === 'current' &&
                      (dao.proposal.filter((pid) => pid.open).length > 0
                        ? dao?.proposal
                            .filter((pid) => pid.open)
                            .map((pid) => (
                              <ProposalItem key={pid.id} proposal={pid} />
                            ))
                        : t('noOpenProposalsInfo'))}
                    {selectedView === 'complete' &&
                      dao.proposal
                        .filter((pid) => pid.finalised)
                        .sort((a, b) => b.id - a.id)
                        .map((pid) => (
                          <ProposalItem key={pid.id} proposal={pid} />
                        ))}
                    {selectedView === 'failed' &&
                      dao.proposal
                        .filter((pid) => !pid.open && !pid.finalised)
                        .sort((a, b) => b.id - a.id)
                        .map((pid) => (
                          <ProposalItem key={pid.id} proposal={pid} />
                        ))}
                  </>
                ) : (
                  <Col xs="auto">
                    <Card className="card-320 card-underlay">
                      <Card.Body>{t('noValidProposals')}</Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            ) : (
              <HelmetLoading height={200} width={200} />
            )}
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
