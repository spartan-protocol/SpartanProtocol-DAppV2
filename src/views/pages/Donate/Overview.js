import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Col,
  InputGroup,
  ProgressBar,
  Row,
  FormControl,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import {
  formatShortString,
  getNetwork,
  getWalletProvider,
} from '../../../utils/web3'
import { communityWalletHoldings } from '../../../store/sparta/actions'
import { useSparta } from '../../../store/sparta/selector'
import { BN, convertToWei, formatFromWei } from '../../../utils/bigNumber'
import { useWeb3 } from '../../../store/web3/selector'
import { getTokenContract } from '../../../utils/web3Contracts'
import { apiUrlBQ, getExplorerWallet, headerBQ } from '../../../utils/extCalls'
import { Icon } from '../../../components/Icons/icons'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const sparta = useSparta()
  const wallet = useWallet()
  const web3 = useWeb3()
  const apiUrl = apiUrlBQ
  const header = headerBQ
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

  const communityWallet = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'

  const [recentTxns, setrecentTxns] = useState([])
  const [bnbPrice, setbnbPrice] = useState(0)
  const getHoldings = async () => {
    dispatch(communityWalletHoldings(wallet.account ? wallet : ''))
    const _bnbPrice = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    )
    setbnbPrice(_bnbPrice.data.binancecoin.usd)
    if (network.chainId === 56) {
      const options = {
        method: 'POST',
        url: apiUrl,
        headers: header,
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
    currency: {in: ["BNB", "0xe9e7cea3dedca5984780bafc599bd69add087d56", "0x55d398326f99059ff775485246999027b3197955"]},
    receiver: {is: $address}) {

    block {
      timestamp {
        time (format: "%Y-%m-%d %H:%M:%S")
      }
      height
    }
    address: sender {
      address
      annotation
    }
    currency {
      address
      symbol
    }
    amount
    transaction {
      hash
    }
    external
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
      const feeBurnTally = await axios.request(options)
      setrecentTxns(feeBurnTally.data.data.ethereum.transfers)
    }
  }
  useEffect(() => {
    getHoldings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [totalUSD, settotalUSD] = useState(0)
  useEffect(() => {
    const _spartaUSD = BN(sparta.communityWallet?.sparta).times(
      web3.spartaPrice,
    )
    const _bnbUSD = BN(sparta.communityWallet?.bnb).times(bnbPrice)
    settotalUSD(
      BN(_spartaUSD)
        .plus(_bnbUSD)
        .plus(sparta.communityWallet?.busd)
        .plus(sparta.communityWallet?.usdt)
        .toString(),
    )
  }, [
    sparta.communityWallet?.sparta,
    sparta.communityWallet?.bnb,
    sparta.communityWallet?.busd,
    sparta.communityWallet?.usdt,
    bnbPrice,
    web3.spartaPrice,
  ])

  const [totalWidth, settotalWidth] = useState(0)
  useEffect(() => {
    settotalWidth(
      BN(totalUSD).div(100000000000000000000000).times(100).toString(),
    )
  }, [totalUSD])

  const [progColor, setprogColor] = useState('primary')
  useEffect(() => {
    let _progColor = 'primary'
    if (totalWidth >= 96) {
      _progColor = 'green'
    } else if (totalWidth >= 30) {
      _progColor = 'info'
    }
    setprogColor(_progColor)
  }, [totalWidth])

  const [selectedAsset, setselectedAsset] = useState(false)
  const inputDonation = document.getElementById('inputDonation')
  useEffect(() => {
    if (inputDonation) {
      inputDonation.value = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset])

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
    return {
      symbol: '',
      name: '',
      addr: '',
    }
  }

  const handleDonation = async () => {
    const asset = getAsset(selectedAsset)
    if (asset.symbol === 'BNB') {
      const signer = getWalletProvider(wallet?.ethereum)
      await signer.sendTransaction({
        to: communityWallet,
        value: ethers.utils.parseEther(inputDonation?.value),
      })
    }
    if (asset.symbol === 'BUSD') {
      const contract = getTokenContract(getAsset('BUSD').addr, wallet)
      await contract.transfer(
        communityWallet,
        convertToWei(inputDonation?.value),
      )
    }
    if (asset.symbol === 'USDT') {
      const contract = getTokenContract(getAsset('USDT').addr, wallet)
      await contract.transfer(
        communityWallet,
        convertToWei(inputDonation?.value),
      )
    }
  }

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col className="">
            <Card className="card-480">
              <Card.Header>
                <Card.Title>{t('communityCrowdfunding')}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs="12" className="my-2">
                    The Spartan Protocol V2 contracts went through a{' '}
                    <a
                      href="https://code423n4.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      CodeArena contest
                    </a>{' '}
                    in July. $96k was put forward by a Spartan community member
                    in advance to pay for the contest.
                    <br />
                    <br />
                    The funds (up to $96k) from the community wallet will be
                    sent to that Spartan once the C4 details are finalised. This
                    donation page will then be repurposed into a general
                    donations page to help fund general costs for the community
                    project ongoing.
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
                  <Col xs="12" className="my-2">
                    <ProgressBar style={{ height: '30px' }}>
                      <ProgressBar
                        variant={progColor}
                        now={totalWidth}
                        label={`$${formatFromWei(totalUSD, 0)} (${t(
                          'donations',
                        )})`}
                      />
                      <ProgressBar variant="black" now={100 - totalWidth} />
                    </ProgressBar>
                  </Col>

                  <Col xs="12" className="my-2">
                    <ProgressBar style={{ height: '30px' }}>
                      <ProgressBar now="30" label="$30K (Min)" />
                      <ProgressBar variant="black" now="0.25" />
                      <ProgressBar
                        variant="info"
                        now="66"
                        label={`$96K (${t('target')})`}
                      />
                      <ProgressBar variant="black" now="0.25" />
                      <ProgressBar variant="green" now="14" label="$110K" />
                    </ProgressBar>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col className="">
            <Card className="card-480">
              <Card.Header>
                <Card.Title>{t('donateToCampaign')}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  {network.chainId === 56 && (
                    <>
                      <Col xs="12" className="my-2">
                        {t('donationsHeldCurrencyInfo')}
                      </Col>
                      <Col xs="12" className="my-2">
                        <Row
                          onClick={() => setselectedAsset('BNB')}
                          role="button"
                        >
                          <Col xs="auto" className="pr-0">
                            <Icon icon="bnb" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col
                                xs="12"
                                className="float-left ml-n4 output-card"
                              >
                                BNB - Binance Coin BEP20 Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {formatFromWei(
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
                          <Col xs="auto" className="pr-0">
                            <Icon icon="busd" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col
                                xs="12"
                                className="float-left ml-n4 output-card"
                              >
                                BUSD - Binance-Peg BUSD Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {formatFromWei(
                                    sparta.communityWallet?.userBusd,
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row
                          onClick={() => setselectedAsset('USDT')}
                          role="button"
                        >
                          <Col xs="auto" className="pr-0">
                            <Icon icon="usdt" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col
                                xs="12"
                                className="float-left ml-n4 output-card"
                              >
                                USDT - Binance-Peg USD-T Token
                                <div className="description">
                                  {t('yourWallet')}:{' '}
                                  {formatFromWei(
                                    sparta.communityWallet?.userUsdt,
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
                            id="inputDonation"
                            placeholder={
                              !selectedAsset
                                ? 'Select asset above...'
                                : `${selectedAsset} donation amount...`
                            }
                            disabled={!selectedAsset}
                          />
                          <InputGroup.Text>{selectedAsset}</InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </>
                  )}
                  {network.chainId !== 56 && (
                    <>
                      <Col>
                        <div>{t('changeToMainnet')}</div>
                      </Col>
                    </>
                  )}
                </Row>
              </Card.Body>
              <Card.Footer>
                {network.chainId === 56 && (
                  <>
                    <Button
                      className="w-100"
                      disabled={inputDonation?.value <= 0 && wallet?.account}
                      onClick={() => handleDonation()}
                    >
                      {t('donate')}
                    </Button>
                  </>
                )}
              </Card.Footer>
            </Card>
          </Col>
          <Col className="">
            <Card className="card-480">
              <Card.Header>
                <Card.Title> {t('recentDonations')}</Card.Title>
              </Card.Header>
              <Card.Body>
                {recentTxns.length > 0 &&
                  recentTxns.map((i) => (
                    <Row key={i.transaction.hash} className="my-2">
                      <Col xs="auto" className="pr-0">
                        {i.currency.symbol === 'BNB' && (
                          <Icon icon="bnb" size="35" />
                        )}
                        {i.currency.symbol === 'BUSD' && (
                          <Icon icon="busd" size="35" />
                        )}
                        {i.currency.symbol === 'USDT' && (
                          <Icon icon="usdt" size="35" />
                        )}
                      </Col>
                      <Col>
                        <Row>
                          <Col xs="12" className="float-left ml-n4 output-card">
                            {i.amount} {i.currency.symbol}
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
                {network.chainId !== 56 && (
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
