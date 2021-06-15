import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBInputGroup,
  MDBInputGroupElement,
  MDBInputGroupText,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
} from 'mdb-react-ui-kit'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import { ReactComponent as BnbIcon } from '../../../assets/icons/bnbb.svg'
import { ReactComponent as BusdIcon } from '../../../assets/icons/busd.svg'
import { ReactComponent as UsdtIcon } from '../../../assets/icons/USDT.svg'
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
  const [trigger1, settrigger1] = useState(0)
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
    if (trigger1 === 0) {
      getHoldings()
    }
    const timer = setTimeout(() => {
      getHoldings()
      settrigger1(trigger1 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1, wallet.account])

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
    if (totalWidth >= 80) {
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
        <MDBRow className="row-480">
          <MDBCol xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('codeArena')}</h2>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="row-480">
          <MDBCol>
            <MDBCard className="card-480">
              <MDBCardHeader>
                <MDBCardTitle>Crowdfunded CodeArena Bounty Target</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol size="12" className="my-2">
                    <MDBCardText>
                      The Spartan Protocol V2 contracts will undergo a{' '}
                      <a
                        href="https://code423n4.com/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        CodeArena audit
                      </a>{' '}
                      in the next available slot.
                    </MDBCardText>
                    <MDBCardText>
                      The scope of contracts to be audited has a recommended
                      bounty requirement of $80k USD. Being a community built
                      and run project; there is a drive to crowdfund the bounty.
                    </MDBCardText>
                    <MDBCardText>
                      The audit will go ahead whether or not the target is
                      reached, but raising $80k will ensure the entire suite of
                      contracts are audited!
                    </MDBCardText>

                    <MDBCardText className="output-card mt-2">
                      View Community Wallet:{' '}
                      <a
                        href="https://bscscan.com/address/0x588f82a66eE31E59B88114836D11e3d00b3A7916"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatShortString(communityWallet)}
                      </a>
                    </MDBCardText>
                  </MDBCol>
                  <MDBCol size="12" className="my-2">
                    <MDBProgress height="15">
                      <MDBProgressBar bgColor={progColor} width={totalWidth}>
                        ${formatFromWei(totalUSD, 0)}
                      </MDBProgressBar>
                      <MDBProgressBar bgColor="black" width={100 - totalWidth}>
                        {'<-- Donations'}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCol>

                  <MDBCol size="12" className="my-2">
                    <MDBProgress height="30">
                      <MDBProgressBar width="30">$30K (Min)</MDBProgressBar>
                      <MDBProgressBar bgColor="black" width="0.25" />
                      <MDBProgressBar bgColor="info" width="50">
                        $80K (Target)
                      </MDBProgressBar>
                      <MDBProgressBar bgColor="black" width="0.25" />
                      <MDBProgressBar bgColor="green" width="20">
                        $100K
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard className="card-480">
              <MDBCardHeader>
                <MDBCardTitle>Donate to the CodeArena Campaign</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBRow>
                  {network.chainId === 56 && (
                    <>
                      <MDBCol size="12" className="my-2">
                        <MDBRow
                          onClick={() => setselectedAsset('BNB')}
                          role="button"
                        >
                          <MDBCol size="auto" className="pr-0">
                            <BnbIcon height="35" width="35" />
                          </MDBCol>
                          <MDBCol>
                            <MDBRow>
                              <MDBCol
                                size="12"
                                className="float-left ml-n4 output-card"
                              >
                                BNB - Binance Coin BEP20 Token
                                <div className="description">
                                  Your Wallet:{' '}
                                  {formatFromWei(
                                    sparta.communityWallet?.userBnb,
                                  )}
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>

                        <MDBRow
                          className="my-3"
                          onClick={() => setselectedAsset('BUSD')}
                          role="button"
                        >
                          <MDBCol size="auto" className="pr-0">
                            <BusdIcon height="35" width="35" />
                          </MDBCol>
                          <MDBCol>
                            <MDBRow>
                              <MDBCol
                                size="12"
                                className="float-left ml-n4 output-card"
                              >
                                BUSD - Binance-Peg BUSD Token
                                <div className="description">
                                  Your Wallet:{' '}
                                  {formatFromWei(
                                    sparta.communityWallet?.userBusd,
                                  )}
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>

                        <MDBRow
                          onClick={() => setselectedAsset('USDT')}
                          role="button"
                        >
                          <MDBCol size="auto" className="pr-0">
                            <UsdtIcon height="35" width="35" />
                          </MDBCol>
                          <MDBCol>
                            <MDBRow>
                              <MDBCol
                                size="12"
                                className="float-left ml-n4 output-card"
                              >
                                USDT - Binance-Peg USD-T Token
                                <div className="description">
                                  Your Wallet:{' '}
                                  {formatFromWei(
                                    sparta.communityWallet?.userUsdt,
                                  )}
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>

                      <MDBCol size="12" className="my-2">
                        <MDBInputGroup>
                          <MDBInputGroupElement
                            type="number"
                            id="inputDonation"
                            placeholder={
                              !selectedAsset
                                ? 'Select asset above...'
                                : `${selectedAsset} donation amount...`
                            }
                            disabled={!selectedAsset}
                          />
                          <MDBInputGroupText>{selectedAsset}</MDBInputGroupText>
                        </MDBInputGroup>
                      </MDBCol>
                      <MDBCol>
                        {network.chainId === 56 && (
                          <>
                            <MDBBtn
                              block
                              disabled={
                                inputDonation?.value <= 0 && wallet?.account
                              }
                              onClick={() => handleDonation()}
                            >
                              Donate
                            </MDBBtn>
                          </>
                        )}
                      </MDBCol>
                    </>
                  )}
                  {network.chainId !== 56 && (
                    <>
                      <MDBCol>
                        <MDBCardText>
                          Switch the DApp and your wallet to mainnet to
                          contribute funds
                        </MDBCardText>
                      </MDBCol>
                    </>
                  )}
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard className="card-480">
              <MDBCardHeader>
                <MDBCardTitle>Recent Donations</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                {recentTxns.length > 0 &&
                  recentTxns.map((i) => (
                    <MDBRow key={i.transaction.hash} className="my-2">
                      <MDBCol size="auto" className="pr-0">
                        {i.currency.symbol === 'BNB' && (
                          <BnbIcon height="35" width="35" />
                        )}
                        {i.currency.symbol === 'BUSD' && (
                          <BusdIcon height="35" width="35" />
                        )}
                        {i.currency.symbol === 'USDT' && (
                          <UsdtIcon height="35" width="35" />
                        )}
                      </MDBCol>
                      <MDBCol>
                        <MDBRow>
                          <MDBCol
                            size="12"
                            className="float-left ml-n4 output-card"
                          >
                            {i.amount} {i.currency.symbol}
                            <div className="description">
                              Donated by:{' '}
                              <a
                                href={getExplorerWallet(i.address.address)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {formatShortString(i.address.address)}
                              </a>
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                    </MDBRow>
                  ))}
                {network.chainId !== 56 && (
                  <>
                    <MDBRow>
                      <MDBCol>
                        <MDBCardText>
                          Switch the DApp and your wallet to mainnet to
                          contribute funds
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  )
}

export default Overview
