import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'

import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import ShareLink from '../Share/ShareLink'
import { Icon } from '../Icons/index'

import { usePool } from '../../store/pool'
import { formatFromWei } from '../../utils/bigNumber'
import { watchAsset } from '../../store/web3'
import { useSynth } from '../../store/synth'
import { appAsset, useApp } from '../../store/app'

import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'
import spartaSynthIcon from '../../assets/tokens/sparta-synth.svg'
import { getSynth, getToken } from '../../utils/math/utils'
import { validSymbols } from '../../containers/FiatOnboard/types'

/**
 * An asset selection dropdown. Selection is pushed into Redux store as 'asset1', 'asset2' or 'asset3'
 * depending on the 'priority' prop handed over. The Redux action also pushes a copy to localStorage for session handling
 * Can be extended out with 'asset4' etc in the future but the current views will only handle '1', '2' & '3' for now
 * @param {uint} priority '1' or '2' or '3'
 * @param {string} type 'pools' (Shows SP-p related fields)
 * @param {array} whiteList tokenAddresses [array]
 * @param {array} blackList tokenAddresses [array]
 */
const AssetSelect = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { address } = useAccount()

  const { addresses, asset1, asset2, asset3 } = useApp()
  const pool = usePool()
  const synth = useSynth()

  const [trigger, settrigger] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [assetArray, setAssetArray] = useState([])
  const [activeTab, setActiveTab] = useState(
    props.defaultTab ? props.defaultTab : 'all',
  )

  const isBNB = (asset) => {
    if (asset.address === addresses.bnb && asset.actualAddr === addresses.bnb)
      return true
    return false
  }

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const changeTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const searchInput = document.getElementById('searchInput')

  const clearSearch = () => {
    searchInput.value = ''
    settrigger((prev) => prev + 1)
  }

  const addSelection = (item) => {
    dispatch(appAsset(props.priority, item.address, item.type))
  }

  const asset = () => {
    if (props.priority === '1') {
      return asset1
    }
    if (props.priority === '2') {
      return asset2
    }
    if (props.priority === '3') {
      return asset3
    }
    console.log('Error, assetSelect priority invalid or not set')
    return false
  }

  const _getToken = (tokenAddress) => getToken(tokenAddress, pool.tokenDetails)

  useEffect(() => {
    const __getToken = (tokenAddress) =>
      getToken(tokenAddress, pool.tokenDetails)
    let finalArray = []
    const getArray = () => {
      if (pool.poolDetails) {
        let tempArray = pool.poolDetails.filter(
          (item) => !props.empty && !item.hide,
        )

        if (props.whiteList) {
          tempArray = tempArray.filter((item1) =>
            props.whiteList.find(
              (item2) =>
                item2 === item1.tokenAddress || item2 === item1.address,
            ),
          )
        }

        if (props.blackList) {
          tempArray = tempArray.filter(
            (item1) =>
              props.blackList.find((item2) => item1.tokenAddress === item2) ===
              undefined,
          )
        }

        for (let i = 0; i < tempArray.length; i++) {
          // Add only sparta
          if (props.filter?.includes('sparta')) {
            if (tempArray[i].tokenAddress === addresses.spartav2) {
              finalArray.push({
                type: 'token',
                icon: (
                  <img
                    className="rounded-circle"
                    height="35px"
                    src={__getToken(tempArray[i].tokenAddress)?.symbolUrl}
                    alt={`${
                      __getToken(tempArray[i].tokenAddress)?.symbol
                    } asset icon`}
                  />
                ),
                iconUrl: __getToken(tempArray[i].tokenAddress)?.symbolUrl,
                symbol: __getToken(tempArray[i].tokenAddress)?.symbol,
                balance: __getToken(tempArray[i].tokenAddress)?.balance,
                address: tempArray[i].tokenAddress,
                actualAddr: tempArray[i].tokenAddress,
              })
            }
          }

          // Add asset to array
          if (props.filter?.includes('token')) {
            finalArray.push({
              type: 'token',
              icon: (
                <img
                  className="rounded-circle"
                  height="35px"
                  src={__getToken(tempArray[i].tokenAddress)?.symbolUrl}
                  alt={`${
                    __getToken(tempArray[i].tokenAddress)?.symbol
                  } asset icon`}
                />
              ),
              iconUrl: __getToken(tempArray[i].tokenAddress)?.symbolUrl,
              symbol: __getToken(tempArray[i].tokenAddress)?.symbol,
              balance: __getToken(tempArray[i].tokenAddress)?.balance,
              address: tempArray[i].tokenAddress,
              actualAddr: tempArray[i].tokenAddress,
            })
          }

          // Add LP token to array
          if (props.filter?.includes('pool')) {
            if (tempArray[i].address) {
              finalArray.push({
                type: 'pool',
                icon: (
                  <>
                    <img
                      className="rounded-circle"
                      height="35px"
                      src={__getToken(tempArray[i].tokenAddress)?.symbolUrl}
                      alt={`${
                        __getToken(tempArray[i].tokenAddress)?.symbol
                      } LP token icon`}
                    />
                    <img
                      src={spartaLpIcon}
                      height="20px"
                      className="token-badge"
                      alt={`${
                        __getToken(tempArray[i].tokenAddress)?.symbol
                      } LP token icon`}
                    />
                  </>
                ),
                iconUrl: __getToken(tempArray[i].tokenAddress)?.symbolUrl,
                symbol: `${__getToken(tempArray[i].tokenAddress)?.symbol}p`,
                balance: tempArray[i].balance,
                address: tempArray[i].tokenAddress,
                actualAddr: tempArray[i].address,
              })
            }
          }

          // Add synth to array
          if (props.filter?.includes('synth')) {
            if (
              getSynth(tempArray[i].tokenAddress, synth.synthDetails)?.address
            ) {
              finalArray.push({
                type: 'synth',
                iconUrl: __getToken(tempArray[i].tokenAddress)?.symbolUrl,
                icon: (
                  <>
                    <img
                      className="rounded-circle"
                      height="35px"
                      src={__getToken(tempArray[i].tokenAddress)?.symbolUrl}
                      alt={`${
                        __getToken(tempArray[i].tokenAddress)?.symbol
                      } synth icon`}
                    />
                    <img
                      src={spartaSynthIcon}
                      height="20px"
                      className="token-badge"
                      alt={`${
                        __getToken(tempArray[i].tokenAddress)?.symbol
                      } LP token icon`}
                    />
                  </>
                ),
                symbol: `${__getToken(tempArray[i].tokenAddress)?.symbol}s`,
                balance: getSynth(tempArray[i].tokenAddress, synth.synthDetails)
                  ?.balance,
                address: tempArray[i].tokenAddress,
                actualAddr: getSynth(
                  tempArray[i].tokenAddress,
                  synth.synthDetails,
                )?.address,
              })
            }
          }
        }
        if (searchInput?.value) {
          finalArray = finalArray.filter((item1) =>
            item1.symbol
              .toLowerCase()
              .includes(searchInput.value.toLowerCase()),
          )
        }
        finalArray = finalArray.sort((a, b) => b.balance - a.balance)
        setAssetArray(finalArray)
      }
    }
    getArray()
  }, [
    addresses.spartav2,
    pool.poolDetails,
    pool.tokenDetails,
    props.blackList,
    props.empty,
    props.filter,
    props.whiteList,
    trigger,
    synth.synthDetails,
    searchInput?.value,
  ])

  const getWalletType = () => {
    if (window.localStorage.getItem('lastWallet') === 'MM') {
      return 'MM'
    }
    if (window.localStorage.getItem('lastWallet') === 'TW') {
      return 'TW'
    }
    return false
  }

  const handleWatchAsset = (item1) => {
    const walletType = getWalletType()
    if (walletType === 'MM' && !isBNB(item1)) {
      dispatch(
        watchAsset(
          item1.actualAddr,
          item1.symbol,
          '18',
          item1.iconUrl,
          address,
        ),
      )
    }
  }

  const handleOnClick = () => {
    toggleModal()
    if (props.onClick) {
      props.onClick()
    }
  }

  return (
    <>
      <Row
        onClick={() =>
          !props.disabled ? handleOnClick() : console.log('button disabled')
        }
        role="button"
      >
        <Col xs="auto" className="position-relative pe-1 ps-0">
          {asset().type === 'token' && (
            <img
              className="rounded-circle"
              height="40px"
              src={_getToken(asset().addr)?.symbolUrl}
              alt={`${_getToken(asset().addr)?.symbol}icon`}
            />
          )}

          {asset().type === 'pool' && (
            <>
              <img
                className="rounded-circle"
                height="40px"
                src={_getToken(asset().addr)?.symbolUrl}
                alt={`${_getToken(asset().addr)?.symbol}icon`}
              />
              <img
                src={spartaLpIcon}
                height="22px"
                className="token-badge-tight"
                alt={`${_getToken(asset().addr)?.symbol} LP token icon`}
              />
            </>
          )}

          {asset().type === 'synth' && (
            <>
              <img
                className="rounded-circle"
                height="40px"
                src={_getToken(asset().addr)?.symbolUrl}
                alt={`${_getToken(asset().addr)?.symbol}icon`}
              />
              <img
                src={spartaSynthIcon}
                height="22px"
                className="token-badge-tight"
                alt={`${_getToken(asset().addr)?.symbol} LP token icon`}
              />
            </>
          )}
        </Col>
        <Col className="px-1 my-auto overflow-hidden">
          <h4 className="mb-0">
            {_getToken(asset().addr)?.symbol}
            {asset().type === 'pool' && 'p'}
            {asset().type === 'synth' && 's'}
            {!props.disabled && (
              <Icon icon="arrowDown" size="13" className="ms-2" />
            )}
          </h4>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('selectAnAsset')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav activeKey={activeTab} fill>
            <Nav.Item key="all">
              <Nav.Link
                eventKey="all"
                onClick={() => {
                  changeTab('all')
                }}
              >
                {t('all')}
              </Nav.Link>
            </Nav.Item>
            {assetArray.filter((item) => item.type === 'token').length > 0 && (
              <Nav.Item key="token">
                <Nav.Link
                  eventKey="token"
                  onClick={() => {
                    changeTab('token')
                  }}
                >
                  {t('tokens')}
                </Nav.Link>
              </Nav.Item>
            )}
            {assetArray.filter((item) => item.type === 'pool').length > 0 && (
              <Nav.Item key="pool">
                <Nav.Link
                  eventKey="pool"
                  onClick={() => {
                    changeTab('pool')
                  }}
                >
                  {t('lpTokens')}
                </Nav.Link>
              </Nav.Item>
            )}
            {assetArray.filter((item) => item.type === 'synth').length > 0 && (
              <Nav.Item key="synth">
                <Nav.Link
                  eventKey="synth"
                  onClick={() => {
                    changeTab('synth')
                  }}
                >
                  {t('synths')}
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          <Row className="my-3">
            <Col xs="12" className="m-auto">
              <InputGroup>
                <InputGroup.Text>
                  <Icon size="18" icon="search" xs="18" fill="grey" />
                </InputGroup.Text>
                <FormControl
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={t('searchAssets')}
                  type="text"
                  id="searchInput"
                  onChange={() => settrigger((prev) => prev + 1)}
                />
                <InputGroup.Text
                  role="button"
                  tabIndex={-1}
                  onKeyPress={() => clearSearch()}
                  onClick={() => clearSearch()}
                >
                  <Icon size="12" icon="close" xs="12" fill="grey" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          {activeTab === 'all' &&
            assetArray.map((item) => (
              <Row key={`${item.actualAddr}-all`} className="mb-3">
                <Col xs="auto" className="position-relative">
                  <div
                    role="button"
                    aria-hidden="true"
                    onClick={() => {
                      addSelection(item)
                      toggleModal()
                    }}
                  >
                    {item.icon}
                  </div>
                </Col>

                <Col xs="5" sm="7" className="align-items-center p-0 ps-sm-1">
                  <Row>
                    <Col xs="12" className="float-left">
                      <strong
                        role="button"
                        aria-hidden="true"
                        onClick={() => {
                          addSelection(item)
                          toggleModal()
                        }}
                      >
                        {item.symbol}
                        <ShareLink url={item.actualAddr}>
                          <Icon icon="copy" size="18" className="ms-2" />
                        </ShareLink>
                      </strong>
                      <div>{formatFromWei(item.balance)}</div>
                    </Col>
                  </Row>
                </Col>

                <Col xs="3" md="3" className="text-end p-0 pe-2">
                  <Row>
                    <Col xs="6">
                      {validSymbols[item.symbol] ? (
                        <Link
                          to={`/buycrypto?asset1=${validSymbols[item.symbol]}`}
                          onClick={() => setShowModal(false)}
                        >
                          <Icon icon="bankCards" size="22" className="ms-1" />
                        </Link>
                      ) : (
                        <div />
                      )}
                    </Col>
                    {getWalletType() && (
                      <Col xs="6">
                        <a
                          href={
                            getWalletType() === 'TW'
                              ? `trust://add_asset?asset=c20000714_t${item.actualAddr}`
                              : '#section'
                          }
                        >
                          <div
                            role="button"
                            aria-hidden="true"
                            onClick={() => {
                              handleWatchAsset(item)
                            }}
                          >
                            {!isBNB(item) && (
                              <>
                                {getWalletType() === 'MM' ? (
                                  <Icon
                                    icon="metamask"
                                    size="24"
                                    className="ms-2"
                                  />
                                ) : (
                                  getWalletType() === 'TW' && (
                                    <Icon
                                      icon="trustwallet"
                                      size="24"
                                      className="ms-2"
                                    />
                                  )
                                )}
                              </>
                            )}
                          </div>
                        </a>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            ))}

          {activeTab !== 'all' &&
            assetArray
              .filter((item) => item.type === activeTab)
              .map((item) => (
                <Row
                  key={item.actualAddr + activeTab}
                  className="mb-3 output-card"
                >
                  <Col xs="auto" className="position-relative">
                    <div
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        addSelection(item)
                        toggleModal()
                      }}
                    >
                      {item.icon}
                    </div>
                  </Col>

                  <Col xs="5" sm="7" className="align-items-center p-0 ps-sm-1">
                    <Row>
                      <Col xs="12" className="float-left">
                        <strong
                          role="button"
                          aria-hidden="true"
                          onClick={() => {
                            addSelection(item)
                            toggleModal()
                          }}
                        >
                          {item.symbol}
                          <ShareLink url={item.actualAddr}>
                            <Icon icon="copy" size="18" className="ms-2" />
                          </ShareLink>
                        </strong>
                        <div>{formatFromWei(item.balance)}</div>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="3" md="3" className="text-end p-0 pe-2">
                    <Row>
                      <Col xs="6">
                        {validSymbols[item.symbol] ? (
                          <Link
                            to={`/buycrypto?asset1=${
                              validSymbols[item.symbol]
                            }`}
                            onClick={() => setShowModal(false)}
                          >
                            <Icon icon="bankCards" size="22" className="ms-1" />
                          </Link>
                        ) : (
                          <div />
                        )}
                      </Col>
                      {getWalletType() && (
                        <Col xs="6">
                          <a
                            href={
                              getWalletType() === 'TW'
                                ? `trust://add_asset?asset=c20000714_t${item.actualAddr}`
                                : '#section'
                            }
                          >
                            <div
                              role="button"
                              aria-hidden="true"
                              onClick={() => {
                                handleWatchAsset(item)
                              }}
                            >
                              {!isBNB(item) && (
                                <>
                                  {getWalletType() === 'MM' ? (
                                    <Icon
                                      icon="metamask"
                                      size="24"
                                      className="ms-2"
                                    />
                                  ) : (
                                    getWalletType() === 'TW' && (
                                      <Icon
                                        icon="trustwallet"
                                        size="24"
                                        className="ms-2"
                                      />
                                    )
                                  )}
                                </>
                              )}
                            </div>
                          </a>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              ))}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssetSelect
