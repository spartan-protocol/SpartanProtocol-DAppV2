import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
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
import { ReactComponent as BnbIcon } from '../../../assets/icons/BNB.svg'
import { getNetwork } from '../../../utils/web3'
import { communityWalletHoldings } from '../../../store/sparta/actions'
import { useSparta } from '../../../store/sparta/selector'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useWeb3 } from '../../../store/web3/selector'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const sparta = useSparta()
  const wallet = useWallet()
  const web3 = useWeb3()
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

  const [bnbPrice, setbnbPrice] = useState(0)
  const [trigger1, settrigger1] = useState(0)
  const getHoldings = async () => {
    dispatch(communityWalletHoldings(wallet))
    const _bnbPrice = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    )
    setbnbPrice(_bnbPrice.data.binancecoin.usd)
  }
  useEffect(() => {
    if (trigger1 === 0) {
      getHoldings()
    }
    const timer = setTimeout(() => {
      getHoldings()
      settrigger1(trigger1 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

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
                <MDBCardTitle>Donate to the CodeArena Campaign</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                {network.chainId === 56 && (
                  <>
                    <MDBCardText onClick={() => setselectedAsset('bnb')}>
                      <MDBRow>
                        <MDBCol size="auto" className="pr-0">
                          <BnbIcon height="35" />
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
                                {formatFromWei(sparta.communityWallet?.userBnb)}
                              </div>
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardText>

                    <MDBCardText>
                      <MDBRow>
                        <MDBCol size="auto" className="pr-0">
                          <BnbIcon height="35" />
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
                    </MDBCardText>

                    <MDBCardText>
                      <MDBRow>
                        <MDBCol size="auto" className="pr-0">
                          <BnbIcon height="35" />
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
                    </MDBCardText>

                    <MDBCardText className="my-3">
                      <MDBInputGroup>
                        <MDBInputGroupElement
                          type="number"
                          placeholder="Donation Amount..."
                        />
                        <MDBInputGroupText>{selectedAsset}</MDBInputGroupText>
                      </MDBInputGroup>
                    </MDBCardText>
                  </>
                )}

                <MDBCardText className="mt-3 mb-2">
                  <MDBProgress height="15">
                    <MDBProgressBar bgColor={progColor} width={totalWidth}>
                      ${formatFromWei(totalUSD, 0)}
                    </MDBProgressBar>
                    <MDBProgressBar bgColor="black" width={100 - totalWidth}>
                      {'<-- Wallet Holdings'}
                    </MDBProgressBar>
                  </MDBProgress>
                </MDBCardText>

                <MDBCardText>
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
                </MDBCardText>
              </MDBCardBody>
              <MDBCardFooter>
                {network.chainId === 56 && (
                  <>
                    <MDBBtn justify="center">Donate</MDBBtn>
                  </>
                )}
                {network.chainId !== 56 && (
                  <>
                    <MDBCardText>
                      Switch the DApp and your wallet to mainnet to contribute
                      funds
                    </MDBCardText>
                  </>
                )}
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard className="card-480">
              <MDBCardHeader>
                <MDBCardTitle>Crowdfunded CodeArena Bounty Target</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBCardText>
                  The Spartan Protocol V2 contracts will undergo a{' '}
                  <a
                    href="https://code423n4.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    CodeArena audit
                  </a>{' '}
                  in the next available slot. The scope of contracts to be
                  audited has a recomended bounty requirement of $80k USD. Being
                  a community built and run project; there is a drive to
                  crowdfund the bounty. The audit will go ahead whether or not
                  the target is reached, but raising $80k will ensure the entire
                  suite of contracts are audited!
                </MDBCardText>
              </MDBCardBody>
              <MDBCardHeader>
                <MDBCardTitle>Recent Donations</MDBCardTitle>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBCardText>Placeholder</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  )
}

export default Overview
