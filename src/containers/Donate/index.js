import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import FormControl from 'react-bootstrap/FormControl'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import { formatShortString } from '../../utils/web3'
import { useSparta, communityWalletHoldings } from '../../store/sparta'
import {
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../utils/bigNumber'
import { useWeb3 } from '../../store/web3'
import { getTokenContract } from '../../utils/getContracts'
import { apiUrlBQ, getExplorerWallet, headerBQ } from '../../utils/extCalls'
import { Icon } from '../../components/Icons/index'
import { useApp } from '../../store/app'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const sparta = useSparta()
  const app = useApp()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const web3 = useWeb3()

  const [txnLoading, setTxnLoading] = useState(false)

  const communityWallet = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'

  const [recentTxns, setrecentTxns] = useState([])
  useEffect(() => {
    const getHoldings = async () => {
      dispatch(communityWalletHoldings(address))
      if (app.chainId === 56) {
        const options = {
          method: 'POST',
          url: apiUrlBQ,
          headers: headerBQ,
          data: {
            query: `query ($network: EthereumNetwork!,
              $address: String!,
              $limit: Int!,
              $offset: Int!
              $from: ISO8601DateTime,
              $till: ISO8601DateTime){
  ethereum(network: $network){
    transfers(options:{desc: "block.timestamp.time"  asc: "currency.symbol" limit: $limit, offset: $offset},
      date: {since: $from till: $till },
      amount: {gt: 0},
      currency: {in: ["BNB", "0xe9e7cea3dedca5984780bafc599bd69add087d56", "0x55d398326f99059ff775485246999027b3197955", "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102"]},
      receiver: {is: $address}) {
  
      block {
        timestamp {
          time (format: "%Y-%m-%d %H:%M:%S")
        }
      }
      address: sender {
        address
      }
      currency {
        symbol
      }
      amount
      transaction {
        hash
      }
    }
  }
  }`,
            variables: {
              limit: 10,
              offset: 0,
              network: 'bsc',
              address: '0x588f82a66ee31e59b88114836d11e3d00b3a7916',
              from: null,
              till: null,
              dateFormat: '%Y-%m-%d',
            },
          },
        }
        const recentDonations = await axios
          .request(options)
          .catch((error) => ({ error }))
        if (!recentDonations.error) {
          setrecentTxns(recentDonations.data.data.ethereum.transfers)
        }
      }
    }
    getHoldings()
  }, [dispatch, app.chainId, address])

  const [selectedAsset, setselectedAsset] = useState(false)
  const inputDonation = document.getElementById('inputDonation')
  useEffect(() => {
    if (inputDonation) {
      inputDonation.value = ''
    }
  }, [inputDonation, selectedAsset])

  const getAsset = (symbol) => {
    if (symbol === 'BNB') {
      return {
        symbol: 'BNB',
        name: 'Binance Coin BEP20 Token',
        addr: '0x0000000000000000000000000000000000000000',
      }
    }
    if (symbol === 'BUSD') {
      return {
        symbol: 'BUSD',
        name: 'Binance-Peg BUSD Token',
        addr: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      }
    }
    if (symbol === 'USDT') {
      return {
        symbol: 'USDT',
        name: 'Binance-Peg USD-T Token',
        addr: '0x55d398326f99059ff775485246999027b3197955',
      }
    }
    if (symbol === 'SPARTA') {
      return {
        symbol: 'SPARTA',
        name: 'SpartanProtocol v2 Token',
        addr: '0x3910db0600eA925F63C36DdB1351aB6E2c6eb102',
      }
    }
    return {
      symbol: '',
      name: '',
      addr: '',
    }
  }

  const handleDonation = async () => {
    setTxnLoading(true)
    const asset = getAsset(selectedAsset)
    if (asset.symbol === 'BNB') {
      // const signer = getWalletProvider(wallet?.library, web3.rpcs)
      await walletClient.sendTransaction({
        to: communityWallet,
        value: parseEther(inputDonation?.value),
      })
    }
    if (asset.symbol === 'BUSD') {
      const contract = getTokenContract(
        getAsset('BUSD').addr,
        walletClient,
        web3.rpcs,
      )
      await contract.write.transfer([
        communityWallet,
        convertToWei(inputDonation?.value),
      ])
    }
    if (asset.symbol === 'USDT') {
      const contract = getTokenContract(
        getAsset('USDT').addr,
        walletClient,
        web3.rpcs,
      )
      await contract.write.transfer([
        communityWallet,
        convertToWei(inputDonation?.value),
      ])
    }
    if (asset.symbol === 'SPARTA') {
      const contract = getTokenContract(
        getAsset('SPARTA').addr,
        walletClient,
        web3.rpcs,
      )
      await contract.write.transfer([
        communityWallet,
        convertToWei(inputDonation?.value),
      ])
    }
    setTxnLoading(false)
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title>
                  <Col xs="auto" className="mt-2 h4">
                    {t('communityCrowdfunding')}
                  </Col>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs="12" className="my-2">
                    {t('donationsInfo')}
                    <br />
                    <br />
                    {t('donationsHeldCurrencyInfo')}
                    <br />
                    <div className="output-card mt-4">
                      {t('viewCommunityWallet')}:{' '}
                      <a
                        href="https://bscscan.com/address/0x588f82a66eE31E59B88114836D11e3d00b3A7916"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatShortString(communityWallet)}
                      </a>
                    </div>
                  </Col>
                  <Col xs="12" className="my-1">
                    {t('communityWalletHoldings')}:
                    <br />
                    <br />
                    <li>
                      BNB:{' '}
                      {!sparta.communityWallet
                        ? 'Loading...'
                        : formatFromWei(sparta.communityWallet.bnb, 2)}
                    </li>
                    <li>
                      BUSD:{' '}
                      {!sparta.communityWallet
                        ? 'Loading...'
                        : formatFromWei(sparta.communityWallet.busd, 2)}
                    </li>
                    <li>
                      USDT:{' '}
                      {!sparta.communityWallet
                        ? 'Loading...'
                        : formatFromWei(sparta.communityWallet.usdt, 2)}
                    </li>
                    <li>
                      SPARTA:{' '}
                      {!sparta.communityWallet
                        ? 'Loading...'
                        : formatFromWei(sparta.communityWallet.sparta, 2)}
                    </li>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title>
                  <Col xs="auto" className="mt-2 h4">
                    {t('donateToCampaign')}
                  </Col>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  {app.chainId === 56 && (
                    <>
                      <Col xs="12" className="my-2">
                        <Row
                          onClick={() => setselectedAsset('BNB')}
                          role="button"
                        >
                          <Col xs="auto" className="pe-0">
                            <Icon icon="bnb" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col xs="12" className="float-left output-card">
                                BNB - Binance Coin BEP20 Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {!sparta.communityWallet
                                    ? 'Loading...'
                                    : formatFromWei(
                                        sparta.communityWallet?.userBnb,
                                      )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row
                          className="my-3"
                          onClick={() => setselectedAsset('BUSD')}
                          role="button"
                        >
                          <Col xs="auto" className="pe-0">
                            <Icon icon="busd" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col xs="12" className="float-left output-card">
                                BUSD - Binance-Peg BUSD Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {!sparta.communityWallet
                                    ? 'Loading...'
                                    : formatFromWei(
                                        sparta.communityWallet?.userBusd,
                                      )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row
                          className="my-3"
                          onClick={() => setselectedAsset('USDT')}
                          role="button"
                        >
                          <Col xs="auto" className="pe-0">
                            <Icon icon="usdt" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col xs="12" className="float-left output-card">
                                USDT - Binance-Peg USD-T Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {!sparta.communityWallet
                                    ? 'Loading...'
                                    : formatFromWei(
                                        sparta.communityWallet?.userUsdt,
                                      )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row
                          onClick={() => setselectedAsset('SPARTA')}
                          role="button"
                        >
                          <Col xs="auto" className="pe-0">
                            <Icon icon="spartav2" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col xs="12" className="float-left output-card">
                                SPARTA - SpartanProtocol v2 Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {!sparta.communityWallet
                                    ? 'Loading...'
                                    : formatFromWei(
                                        sparta.communityWallet?.userSparta,
                                      )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>

                      <Col xs="12" className="my-2">
                        <InputGroup>
                          <FormControl
                            type="number"
                            min="0"
                            step="any"
                            id="inputDonation"
                            placeholder={
                              !selectedAsset
                                ? `${t('selectAssetAbove')}...`
                                : `${selectedAsset} ${t('donationAmount')}...`
                            }
                            disabled={!selectedAsset}
                          />
                          <InputGroup.Text>{selectedAsset}</InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </>
                  )}
                  {app.chainId !== 56 && (
                    <>
                      <Col>
                        <div>{t('changeToMainnet')}</div>
                      </Col>
                    </>
                  )}
                </Row>
              </Card.Body>
              <Card.Footer>
                {app.chainId === 56 && (
                  <>
                    <Button
                      className="w-100"
                      disabled={inputDonation?.value <= 0 && address}
                      onClick={() => handleDonation()}
                    >
                      {t('donate')}
                      {txnLoading && (
                        <Icon
                          fill="white"
                          icon="cycle"
                          size="20"
                          className="anim-spin ms-1"
                        />
                      )}
                    </Button>
                  </>
                )}
              </Card.Footer>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title>
                  <Col xs="auto" className="mt-2 h4">
                    {t('currentCampaigns')}
                  </Col>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col xs="auto" className="pe-0">
                    <Icon icon="spartav2" size="35" />
                  </Col>
                  <Col>
                    <Row>
                      <Col xs="12" className="float-left output-card">
                        No campaigns open
                        <div className="description fw-light">
                          {t('budget')}: N/A
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col xs="12" className="output-card mt-1">
                      There are currently no donation campaigns open. If in the
                      future something big and expensive is planned (like code
                      audits for V3 for instance) we can consider adding the
                      info here and taking donations. Until then, smaller
                      community campaigns can be run in the community channels /
                      social media.
                    </Col>
                  </Row>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title>
                  <Col xs="auto" className="mt-2 h4">
                    {t('recentDonations')}
                  </Col>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {recentTxns?.length > 0 &&
                  recentTxns.map((i) => (
                    <Row key={i.transaction.hash + i.amount} className="my-2">
                      <Col xs="auto" className="pe-0">
                        {i.currency.symbol === 'BNB' && (
                          <Icon icon="bnb" size="35" />
                        )}
                        {i.currency.symbol === 'BUSD' && (
                          <Icon icon="busd" size="35" />
                        )}
                        {i.currency.symbol === 'USDT' && (
                          <Icon icon="usdt" size="35" />
                        )}
                        {i.currency.symbol === 'SPARTA' && (
                          <Icon icon="spartav2" size="35" />
                        )}
                      </Col>
                      <Col>
                        <Row>
                          <Col xs="12" className="float-left output-card">
                            {formatFromUnits(i.amount, 2)} {i.currency.symbol}
                            <div className="description">
                              {t('donatedBy')}:{' '}
                              <a
                                href={getExplorerWallet(i.address.address)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {formatShortString(i.address.address)}
                              </a>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                {app.chainId !== 56 && (
                  <>
                    <Row>
                      <Col>
                        <div>{t('changeToMainnet')}</div>
                      </Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview
