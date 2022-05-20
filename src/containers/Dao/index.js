import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import ProposalItem from './ProposalItem'
import {
  useDao,
  daoGlobalDetails,
  daoMemberDetails,
  daoProposalDetails,
  daoVaultWeight,
  getDaoDetails,
  proposalWeight,
} from '../../store/dao'
import NewProposal from './NewProposal'
import { getNetwork, tempChains } from '../../utils/web3'
import { convertTimeUnits } from '../../utils/math/nonContract'
import WrongNetwork from '../../components/WrongNetwork/index'
import { usePool } from '../../store/pool'
import { bondVaultWeight, getBondDetails, useBond } from '../../store/bond'
import { useSynth, getSynthDetails } from '../../store/synth'
import HelmetLoading from '../../components/Spinner/index'
import { BN, formatFromWei } from '../../utils/bigNumber'
import { Icon } from '../../components/Icons/index'
import { proposalTypes } from './types'
import { useWeb3 } from '../../store/web3'

const Overview = () => {
  const dispatch = useDispatch()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const web3 = useWeb3()
  const synth = useSynth()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const network = getNetwork()

  const [selectedView, setSelectedView] = useState('current')

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
            <Row className="mb-3">
              <Col>
                <Nav
                  variant="pills"
                  activeKey={selectedView}
                  onSelect={(e) => setSelectedView(e)}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="current" className="btn-sm">
                      {t('open')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="complete" className="btn-sm">
                      {t('completed')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="failed" className="btn-sm">
                      {t('failed')}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="4" className="mb-3">
                <Card style={{ minHeight: '285px' }}>
                  <Card.Header>
                    <h4>{t('daoProposals')}</h4>
                    <Card.Subtitle>
                      <small>{t('helpGovern')}</small>
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row className="my-1">
                        <Col>{t('proposalCount')}</Col>
                        <Col xs="auto" className="text-end">
                          {dao.global.currentProposal}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col>{t('daoRunning')}</Col>
                        <Col xs="auto" className="text-end">
                          {dao.global.running
                            ? t('daoRunningYes')
                            : t('daoRunningNo')}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col>{t('coolOffPeriod')}</Col>
                        <Col xs="auto" className="text-end">
                          {convertTimeUnits(dao.global.coolOffPeriod, t)}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col>{t('cancelPeriod')}</Col>
                        <Col xs="auto" className="text-end">
                          {convertTimeUnits(dao.global.cancelPeriod, t)}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col>{t('totalWeight')}</Col>
                        <Col xs="auto" className="text-end">
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
                    <HelmetLoading height={100} width={100} />
                  )}

                  <Card.Footer>
                    <Link to="/vaults">
                      <Button className="w-100 btn-sm">{t('addWeight')}</Button>
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
                            <Col xs="12" sm="6" lg="4" className="mb-2">
                              <Card style={{ minHeight: '285px' }}>
                                <Card.Header>
                                  {t(
                                    proposalTypes.filter(
                                      (i) =>
                                        i.value ===
                                        dao.proposal[
                                          dao.global.currentProposal - 1
                                        ].proposalType,
                                    )[0].label,
                                  )}
                                  <Card.Subtitle className="">
                                    {t(
                                      proposalTypes.filter(
                                        (i) =>
                                          i.value ===
                                          dao.proposal[
                                            dao.global.currentProposal - 1
                                          ].proposalType,
                                      )[0].desc,
                                    )}
                                  </Card.Subtitle>
                                </Card.Header>
                                <Card.Body className="pb-0 output-card">
                                  {t(
                                    proposalTypes.filter(
                                      (i) =>
                                        i.value ===
                                        dao.proposal[
                                          dao.global.currentProposal - 1
                                        ].proposalType,
                                    )[0].longDesc,
                                  )}
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
                                      <Button className="w-100 btn-sm">
                                        {t('viewInDocs')}
                                        <Icon
                                          icon="scan"
                                          size="15"
                                          fill="white"
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
                            <Card>
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
                            <Card>
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
                            <Card>
                              <Card.Body>{t('noValidProposals')}</Card.Body>
                            </Card>
                          </Col>
                        ))}
                    </>
                  ) : (
                    <Col xs="auto">
                      <Card>
                        <Card.Body>{t('noValidProposals')}</Card.Body>
                      </Card>
                    </Col>
                  )}
                </>
              ) : (
                <HelmetLoading height={100} width={100} />
              )}
            </Row>
          </>
        )}
        {network.chainId && !tempChains.includes(network.chainId) && (
          <WrongNetwork />
        )}
      </div>
    </>
  )
}

export default Overview