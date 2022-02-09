import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
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
import { convertTimeUnits } from '../../../utils/math/nonContract'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool/selector'
import { bondVaultWeight, getBondDetails, useBond } from '../../../store/bond'
import { getSynthDetails } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { Icon } from '../../../components/Icons/icons'
import { proposalTypes } from './types'
import { useWeb3 } from '../../../store/web3'

const Overview = () => {
  const dispatch = useDispatch()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const web3 = useWeb3()
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
      dispatch(daoGlobalDetails(web3.rpcs))
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
      dispatch(daoMemberDetails(wallet, web3.rpcs))
      dispatch(
        daoProposalDetails(dao.global?.currentProposal, wallet, web3.rpcs),
      )
      dispatch(
        proposalWeight(
          dao.global?.currentProposal,
          pool.poolDetails,
          web3.rpcs,
        ),
      )
      dispatch(daoVaultWeight(pool.poolDetails, web3.rpcs))
      dispatch(bondVaultWeight(pool.poolDetails, web3.rpcs))
      dispatch(getDaoDetails(pool.listedPools, wallet, web3.rpcs))
      dispatch(getBondDetails(pool.listedPools, wallet, web3.rpcs))
      dispatch(getSynthDetails(synth.synthArray, wallet, web3.rpcs))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.global, dao.newProp])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    if (dao.global.currentProposal === 0 || !dao.proposal) {
      return true
    }
    return false
  }

  const totalWeight = () => {
    if (dao.totalWeight && bond.totalWeight) {
      const _totalWeight = BN(dao.totalWeight).plus(bond.totalWeight)
      if (_totalWeight > 0) {
        return formatFromWei(_totalWeight, 0)
      }
      return '0.00'
    }
    return 'Loading...'
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            <Row className="row-480">
              <Col>
                <Tabs
                  activeKey={selectedView}
                  onSelect={(k) => setSelectedView(k)}
                  className="mb-3 card-480"
                >
                  <Tab eventKey="current" title={t('open')} />
                  <Tab eventKey="complete" title={t('completed')} />
                  <Tab eventKey="failed" title={t('failed')} />
                </Tabs>
              </Col>
            </Row>
            <Row className="row-480">
              <Col xs="auto" className="">
                <Card
                  xs="auto"
                  className="card-320"
                  style={{ minHeight: '320px' }}
                >
                  <Card.Header>
                    {t('daoProposals')}
                    <Card.Subtitle className="">
                      {t('helpGovern')}
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('proposalCount')}
                        </Col>
                        <Col className="text-end output-card">
                          {dao.global.currentProposal}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('daoRunning')}
                        </Col>
                        <Col className="text-end output-card">
                          {dao.global.running
                            ? t('daoRunningYes')
                            : t('daoRunningNo')}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('coolOffPeriod')}
                        </Col>
                        <Col className="text-end output-card">
                          {convertTimeUnits(dao.global.coolOffPeriod, t)}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('cancelPeriod')}
                        </Col>
                        <Col className="text-end output-card">
                          {convertTimeUnits(dao.global.cancelPeriod, t)}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('totalWeight')}
                        </Col>
                        <Col className="text-end output-card">
                          {totalWeight()}
                          <Icon
                            icon="spartav2"
                            size="20"
                            className="mb-1 ms-1"
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  ) : (
                    <HelmetLoading />
                  )}

                  <Card.Footer>
                    <Link to="/vaults">
                      <Button className="w-100">{t('addWeight')}</Button>
                    </Link>
                    <NewProposal />
                  </Card.Footer>
                </Card>
              </Col>

              {!isLoading() ? (
                <>
                  {dao.proposal.length > 0 ? (
                    <>
                      {selectedView === 'current' &&
                        (dao.proposal[dao.global.currentProposal - 1]?.open ? (
                          <>
                            <ProposalItem
                              key={
                                dao.proposal[dao.global.currentProposal - 1].id
                              }
                              proposal={
                                dao.proposal[dao.global.currentProposal - 1]
                              }
                            />
                            <Col>
                              <Card
                                className="card-320"
                                style={{ minHeight: '320px' }}
                              >
                                <Card.Header>
                                  {
                                    proposalTypes.filter(
                                      (i) =>
                                        i.value ===
                                        dao.proposal[
                                          dao.global.currentProposal - 1
                                        ].proposalType,
                                    )[0].label
                                  }
                                  <Card.Subtitle className="">
                                    {
                                      proposalTypes.filter(
                                        (i) =>
                                          i.value ===
                                          dao.proposal[
                                            dao.global.currentProposal - 1
                                          ].proposalType,
                                      )[0].desc
                                    }
                                  </Card.Subtitle>
                                </Card.Header>
                                <Card.Body className="pb-0 output-card">
                                  {
                                    proposalTypes.filter(
                                      (i) =>
                                        i.value ===
                                        dao.proposal[
                                          dao.global.currentProposal - 1
                                        ].proposalType,
                                    )[0].longDesc
                                  }
                                </Card.Body>
                                {proposalTypes.filter(
                                  (i) =>
                                    i.value ===
                                    dao.proposal[dao.global.currentProposal - 1]
                                      .proposalType,
                                )[0].docsLink && (
                                  <Card.Footer>
                                    <a
                                      href={
                                        proposalTypes.filter(
                                          (i) =>
                                            i.value ===
                                            dao.proposal[
                                              dao.global.currentProposal - 1
                                            ].proposalType,
                                        )[0].docsLink
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Button className="w-100">
                                        {t('viewInDocs')}
                                        <Icon
                                          icon="scan"
                                          size="15"
                                          className="ms-2 mb-1"
                                        />
                                      </Button>
                                    </a>
                                  </Card.Footer>
                                )}
                              </Card>
                            </Col>
                          </>
                        ) : (
                          <Col xs="auto">
                            <Card className="card-320">
                              <Card.Body>{t('noOpenProposalsInfo')}</Card.Body>
                            </Card>
                          </Col>
                        ))}
                      {selectedView === 'complete' &&
                        (dao.proposal.filter((pid) => pid.finalised).length >
                        0 ? (
                          dao.proposal
                            .filter((pid) => pid.finalised)
                            .sort((a, b) => b.id - a.id)
                            .map((pid) => (
                              <ProposalItem key={pid.id} proposal={pid} />
                            ))
                        ) : (
                          <Col xs="auto">
                            <Card className="card-320">
                              <Card.Body>{t('noValidProposals')}</Card.Body>
                            </Card>
                          </Col>
                        ))}
                      {selectedView === 'failed' &&
                        (dao.proposal.filter(
                          (pid) => !pid.open && !pid.finalised,
                        ).length > 0 ? (
                          dao.proposal
                            .filter((pid) => !pid.open && !pid.finalised)
                            .sort((a, b) => b.id - a.id)
                            .map((pid) => (
                              <ProposalItem key={pid.id} proposal={pid} />
                            ))
                        ) : (
                          <Col xs="auto">
                            <Card className="card-320">
                              <Card.Body>{t('noValidProposals')}</Card.Body>
                            </Card>
                          </Col>
                        ))}
                    </>
                  ) : (
                    <Col xs="auto">
                      <Card className="card-320">
                        <Card.Body>{t('noValidProposals')}</Card.Body>
                      </Card>
                    </Col>
                  )}
                </>
              ) : (
                <HelmetLoading height={200} width={200} />
              )}
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview
