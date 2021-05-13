import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row, Button, Card } from 'reactstrap'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { bondClaimAll } from '../../../store/bond/actions'
import { usePool } from '../../../store/pool'
import { formatFromWei } from '../../../utils/bigNumber'
import { getNetwork } from '../../../utils/web3'
import BondItem from './BondItem'

const Bond = () => {
  const pool = usePool()
  const wallet = useWallet()
  const dispatch = useDispatch()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-2">Bond</h2>
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <Row className="row-480">
            <Col xs="auto">
              <Card
                className="card-body card-320"
                style={{ backgroundColor: '#25212D' }}
              >
                <h3>Bond Positions</h3>
                {pool.poolDetails?.length > 0 &&
                  pool.poolDetails
                    .filter((asset) => asset.bonded > 0)
                    .map((asset) => (
                      <Row key={asset.address} className="my-1">
                        <Col xs="auto" className="text-card">
                          Remaining
                        </Col>
                        <Col className="text-right output-card">
                          {formatFromWei(asset.bonded)}{' '}
                          {getToken(asset.tokenAddress)?.symbol}p
                        </Col>
                      </Row>
                    ))}
                {pool.poolDetails.filter((asset) => asset.bonded > 0).length <=
                  0 && (
                  <Row className="my-1">
                    <Col xs="auto" className="text-card">
                      You have no Bond positions
                    </Col>
                  </Row>
                )}
                <Row className="text-center mt-3">
                  <Col xs="12" className="p-1">
                    <Button
                      className="btn btn-primary align-middle"
                      onClick={() => dispatch(bondClaimAll(wallet.account))}
                    >
                      Claim All{' ( '}
                      {pool.poolDetails?.length > 0 &&
                        pool.poolDetails.filter((asset) => asset.bonded > 0)
                          .length}
                      {' )'}
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            {pool.poolDetails?.length > 0 &&
              pool.poolDetails
                .filter((asset) => asset.bondLastClaim > 0)
                .sort((a, b) => b.bonded - a.bonded)
                .map((asset) => (
                  <BondItem asset={asset} key={asset.tokenAddress} />
                ))}
          </Row>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Bond
