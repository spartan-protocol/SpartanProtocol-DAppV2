import { useWalletClient } from 'wagmi'
import React, { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePool } from '../../store/pool'
import { updatePoolStatus } from '../../store/router'
import { useSparta } from '../../store/sparta'

const PoolStatus = () => {
  const pool = usePool()
  const dispatch = useDispatch()
  const { data: walletClient } = useWalletClient()
  const sparta = useSparta()
  const navigate = useNavigate()
  const [selectedAsset, setselectedAsset] = useState('')
  const frozenPools = pool.poolDetails?.filter(
    (asset) => asset.frozen && asset.curated,
  )
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((asset) => asset.address === tokenAddress)[0]

  return (
    <>
      <Col>
        <Card className="card-480">
          <Card.Header>Ratio-Check Pools</Card.Header>
          <Card.Body>
            Global Freeze:{' '}
            {sparta.globalDetails.globalFreeze ? 'True' : 'False'}
            <br />
            <br />
            {frozenPools.length > 0 ? (
              <>
                The following curated pools have triggered a warning. Arbitrage
                the pools to match the external markets and wait for the rates
                to normalise.
                {frozenPools.map((asset) => (
                  <Form className="my-2" key={asset.tokenAddress}>
                    <Form.Check
                      id={asset.tokenAddress}
                      type="radio"
                      label={`${getToken(asset.tokenAddress)?.symbol}:SPARTA`}
                      onClick={() => setselectedAsset(asset.tokenAddress)}
                      checked={selectedAsset === asset.tokenAddress}
                      readOnly
                    />
                  </Form>
                ))}
              </>
            ) : (
              <>
                All curated pools are within their ratio safety levels.
                {sparta.globalDetails.globalFreeze &&
                  ' Press the below button to unfreeze the protocol. Be aware you will have to pay some gas.'}
              </>
            )}
          </Card.Body>
          <Card.Footer>
            {frozenPools.length > 0 ? (
              <Button
                className="w-100"
                onClick={() => navigate(`/swap?asset1=${selectedAsset}`)}
                disabled={!selectedAsset}
              >
                Arbitrage
              </Button>
            ) : (
              <Button
                className="w-100"
                onClick={() => dispatch(updatePoolStatus(walletClient))}
                disabled={!sparta.globalDetails.globalFreeze}
              >
                Un-freeze Protocol
              </Button>
            )}
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default PoolStatus
