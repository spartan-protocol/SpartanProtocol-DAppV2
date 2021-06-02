import React, { useState, useEffect } from 'react'
import { Row, Col, Card } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import ProposalItem from './ProposalItem'
import { useDao } from '../../../store/dao/selector'
import {
  getDaoProposalDetails,
  getDaoVaultGlobalDetails,
  getDaoVaultMemberDetails,
} from '../../../store/dao/actions'
import NewProposal from './NewProposal'

const Overview = () => {
  const dispatch = useDispatch()
  const dao = useDao()
  const wallet = useWallet()
  const { t } = useTranslation()

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(getDaoVaultGlobalDetails(wallet))
    dispatch(getDaoProposalDetails(wallet))
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
    dispatch(getDaoVaultMemberDetails(wallet))
    dispatch(getDaoProposalDetails(wallet))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.globalDetails])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('dao')}</h2>
              <NewProposal />
            </div>
          </Col>
        </Row>

        <Row className="row-480">
          {dao?.proposalDetails.length > 0 &&
            dao?.proposalDetails
              .filter((pid) => pid.finalised !== 1)
              .sort((a, b) => b.votes - a.votes)
              .map((pid) => <ProposalItem key={pid.address} pid={pid} />)}
          {dao?.proposalDetails.length <= 0 && (
            <Col xs="auto">
              <Card className="card-body card-320 pt-3 pb-2 card-underlay">
                <Row className="mb-2">
                  <Col xs="auto" className="pr-0 my-auto">
                    <h4 className="my-auto">No valid proposals found</h4>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </>
  )
}

export default Overview
