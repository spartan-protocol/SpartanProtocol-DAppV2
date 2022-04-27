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
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import {
  formatShortString,
  getNetwork,
  getWalletProvider,
} from '../../utils/web3'
import { useSparta, communityWalletHoldings } from '../../store/sparta'
import {
  // BN,
  convertToWei,
  // formatFromUnits,
  formatFromWei,
} from '../../utils/bigNumber'
import { useWeb3 } from '../../store/web3'
import { getTokenContract } from '../../utils/getContracts'
import { apiUrlBQ, getExplorerWallet, headerBQ } from '../../utils/extCalls'
import { Icon } from '../../components/Icons/index'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const sparta = useSparta()
  const wallet = useWeb3React()
  const web3 = useWeb3()
  const apiUrl = apiUrlBQ
  const header = headerBQ
  const network = getNetwork()

  const [txnLoading, setTxnLoading] = useState(false)

  const communityWallet = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'

  const [recentTxns, setrecentTxns] = useState([])
  // const [bnbPrice, setbnbPrice] = useState(0)
  const getHoldings = async () => {
    dispatch(communityWalletHoldings(wallet.account ? wallet : ''))
    // const _bnbPrice = await axios.get(
    //   'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    // )
    // setbnbPrice(_bnbPrice.data.binancecoin.usd)
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
  useEffect(() => {
    getHoldings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const [totalUSD, settotalUSD] = useState(0)
  // useEffect(() => {
  //   const _spartaUSD = BN(sparta.communityWallet?.sparta).times(
  //     web3.spartaPrice,
  //   )
  //   const _bnbUSD = BN(sparta.communityWallet?.bnb).times(bnbPrice)
  //   settotalUSD(
  //     BN(_spartaUSD)
  //       .plus(_bnbUSD)
  //       .plus(sparta.communityWallet?.busd)
  //       .plus(sparta.communityWallet?.usdt)
  //       .toString(),
  //   )
  // }, [
  //   sparta.communityWallet?.sparta,
  //   sparta.communityWallet?.bnb,
  //   sparta.communityWallet?.busd,
  //   sparta.communityWallet?.usdt,
  //   bnbPrice,
  //   web3.spartaPrice,
  // ])

  // const [totalWidth, settotalWidth] = useState(0)
  // useEffect(() => {
  //   settotalWidth(
  //     BN(totalUSD).div(9000000000000000000000).times(100).toString(),
  //   )
  // }, [totalUSD])

  // const [progColor, setprogColor] = useState('primary')
  // useEffect(() => {
  //   let _progColor = 'primary'
  //   if (totalWidth >= 56) {
  //     _progColor = 'green'
  //   } else if (totalWidth >= 44) {
  //     _progColor = 'info'
  //   }
  //   setprogColor(_progColor)
  // }, [totalWidth])

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
                {/* <Row>
                  <Col xs="12" className="output-card mt-1">
                    Normal text
                    <div className="description">Subheading:</div>
                    Normal text
                  </Col>
                </Row> */}
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
                  {/* <Col xs="12" className="my-2">
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
                  </Col> */}

                  {/* <Col xs="12" className="my-2">
                    <ProgressBar style={{ height: '20px' }}>
                      <ProgressBar now="55.25" label="$5K (Global AMA)" />
                      <ProgressBar variant="black" now="0.25" />
                      <ProgressBar
                        variant="info"
                        now="44.5"
                        label="$4K (Turkey AMA)"
                      />
                    </ProgressBar>
                  </Col> */}
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
                        #FridayFor300 Quiz
                        <div className="description fw-light">
                          {t('budget')}: 300 SPARTA per week (Via community
                          donations)
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col xs="12" className="output-card mt-1">
                      Each week there is a #LearnToEarn quiz launched on Twitter
                      for general positive community action and to help drive
                      community members to actively engage with learning about
                      the protocol. If you would like to sponsor a quiz prize,
                      please donate exactly 300 SPARTA and let an admin know
                      (Telegram or Twitter) if you would like to be tagged in
                      the tweet as a sponsor.
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
