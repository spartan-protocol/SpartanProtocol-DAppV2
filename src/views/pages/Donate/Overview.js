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
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import {
  formatShortString,
  getNetwork,
  getWalletProvider,
} from '../../../utils/web3'
import { communityWalletHoldings } from '../../../store/sparta/actions'
import { useSparta } from '../../../store/sparta/selector'
import {
  BN,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../../utils/bigNumber'
import { useWeb3 } from '../../../store/web3/selector'
import { getTokenContract } from '../../../utils/web3Contracts'
import { apiUrlBQ, getExplorerWallet, headerBQ } from '../../../utils/extCalls'
import { Icon } from '../../../components/Icons/icons'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const sparta = useSparta()
  const wallet = useWeb3React()
  const web3 = useWeb3()
  const apiUrl = apiUrlBQ
  const header = headerBQ

  const [txnLoading, setTxnLoading] = useState(false)
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
    currency: {in: ["BNB", "0xe9e7cea3dedca5984780bafc599bd69add087d56", "0x55d398326f99059ff775485246999027b3197955", "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102"]},
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
      BN(totalUSD).div(9000000000000000000000).times(100).toString(),
    )
  }, [totalUSD])

  const [progColor, setprogColor] = useState('primary')
  useEffect(() => {
    let _progColor = 'primary'
    if (totalWidth >= 56) {
      _progColor = 'green'
    } else if (totalWidth >= 44) {
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
      const signer = getWalletProvider(wallet?.library, web3.rpcs)
      await signer.sendTransaction({
        to: communityWallet,
        value: ethers.utils.parseEther(inputDonation?.value),
      })
    }
    if (asset.symbol === 'BUSD') {
      const contract = getTokenContract(
        getAsset('BUSD').addr,
        wallet,
        web3.rpcs,
      )
      await contract.transfer(
        communityWallet,
        convertToWei(inputDonation?.value),
      )
    }
    if (asset.symbol === 'USDT') {
      const contract = getTokenContract(
        getAsset('USDT').addr,
        wallet,
        web3.rpcs,
      )
      await contract.transfer(
        communityWallet,
        convertToWei(inputDonation?.value),
      )
    }
    if (asset.symbol === 'SPARTA') {
      const contract = getTokenContract(
        getAsset('SPARTA').addr,
        wallet,
        web3.rpcs,
      )
      await contract.transfer(
        communityWallet,
        convertToWei(inputDonation?.value),
      )
    }
    setTxnLoading(false)
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
                {/* <Row>
                  <Col xs="12" className="output-card mt-1">
                    Normal text
                    <div className="description">Subheading:</div>
                    Normal text
                  </Col>
                </Row> */}
                <Row>
                  <Col xs="12" className="my-2">
                    This wallet holds donations from the community to fund
                    activites and expenses that the community puts forward as
                    important for SPARTA to continue building its shieldwall
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
                  <Col xs="12" className="my-2">
                    <ProgressBar style={{ height: '26px' }}>
                      <ProgressBar
                        variant={progColor}
                        now={totalWidth}
                        label={
                          totalWidth > 50 &&
                          `$${formatFromWei(totalUSD, 0)} (${t('donations')})`
                        }
                      />
                      <ProgressBar
                        variant="black"
                        now={100 - totalWidth}
                        label={
                          totalWidth <= 50 &&
                          `$${formatFromWei(totalUSD, 0)} (${t('donations')})`
                        }
                      />
                    </ProgressBar>
                  </Col>

                  <Col xs="12" className="my-2">
                    <ProgressBar style={{ height: '20px' }}>
                      <ProgressBar now="55.25" label="$5K (Global AMA)" />
                      <ProgressBar variant="black" now="0.25" />
                      <ProgressBar
                        variant="info"
                        now="44.5"
                        label="$4K (Turkey AMA)"
                      />
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
                          <Col xs="auto" className="pe-0">
                            <Icon icon="busd" size="35" />
                          </Col>
                          <Col>
                            <Row>
                              <Col xs="12" className="float-left output-card">
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
                                  {formatFromWei(
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
                                  {formatFromWei(
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
                      {txnLoading && (
                        <Icon
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

          <Col className="">
            <Card className="card-480">
              <Card.Header>
                <Card.Title> {t('currentCampaigns')}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col xs="auto" className="pe-0">
                    <Icon icon="bnb" size="35" />
                  </Col>
                  <Col>
                    <Row>
                      <Col xs="12" className="float-left output-card">
                        Binance Global AMA
                        <div className="description">
                          {t('budget')}: ${formatFromUnits(5000)} USD
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col xs="12" className="output-card mt-1">
                      There is no fee for AMAs however a promotional budget will
                      be provided to give away to the community during the
                      event.
                      <div className="description">Global Focus:</div>
                      An English / global AMA makes perfect sense with the
                      launch of V2; support will be required from the community
                      to organise, run and provide answers for the AMA, please
                      reach out if you feel you have some way of helping.
                    </Col>
                  </Row>
                </Row>
                <hr />
                <Row className="my-2">
                  <Col xs="auto" className="pe-0">
                    <Icon icon="turkeyFlag" size="35" />
                  </Col>
                  <Col>
                    <Row>
                      <Col xs="12" className="float-left output-card">
                        Binance Turkey AMA
                        <div className="description">
                          {t('budget')}: ${formatFromUnits(4000)} USD
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col xs="12" className="output-card mt-1">
                      There is no fee for AMAs however a promotional budget will
                      be provided to give away to the community during the
                      event.
                      <div className="description">Turkey Focus:</div>
                      Whilst a Turkish AMA might seem like a strange focus for a
                      globally distributed project, Turkish users currently make
                      up the largest portion of Spartan Protocol searches on
                      Google, signalling a need for more support and education
                      in their native language.
                      <div className="description">Turkish Community:</div>
                      The Turkish community has already signalled their
                      commitment to donate towards covering their costs of the
                      AMA and are also actively involved in the grunt work on
                      organising both AMAs. This is ultimately good for the
                      project as a whole and support from the global community
                      would be appreciated
                    </Col>
                  </Row>
                </Row>
              </Card.Body>
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
