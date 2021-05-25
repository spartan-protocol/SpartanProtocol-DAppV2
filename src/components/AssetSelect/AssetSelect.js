/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { usePool } from '../../store/pool'
import { formatFromWei } from '../../utils/bigNumber'
import { watchAsset } from '../../store/web3'
import ShareLink from '../Share/ShareLink'
// import MetaMask from '../../assets/icons/metamask.svg'
import spartaIcon from '../../assets/img/spartan_lp.svg'
import spartaIconAlt from '../../assets/img/spartan_synth.svg'
import { useSynth } from '../../store/synth/selector'
import { getAddresses } from '../../utils/web3'
/**
 * An asset selection dropdown. Selection is stored in localStorage under 'assetSelected1' or 'assetSelected2'
 * depending on the 'priority' prop handed over.
 * Can be extended out with 'assetSelected3' etc in the future but the current views will only handle '1' and '2' for now
 * @param {uint} priority '1' or '2'
 * @param {string} type 'pools' (Shows SP-p related fields)
 * @param {array} whiteList tokenAddresses [array]
 * @param {array} blackList tokenAddresses [array]
 */
const AssetSelect = (props) => {
  const addr = getAddresses()
  const synth = useSynth()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)

  const [activeTab, setActiveTab] = useState('all')
  const pool = usePool()

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const changeTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const searchInput = document.getElementById('searchInput')

  const clearSearch = () => {
    searchInput.value = ''
  }

  const addSelection = (asset) => {
    const tempAsset = pool.poolDetails.filter(
      (i) => i.tokenAddress === asset.address,
    )
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify(tempAsset[0]),
    )
    window.localStorage.setItem(`assetType${props.priority}`, asset.type)
  }

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  const [selectedItem, setSelectedItem] = useState(
    tryParse(window.localStorage.getItem(`assetSelected${props.priority}`)),
  )
  const [selectedType, setSelectedType] = useState(
    window.localStorage.getItem(`assetType${props.priority}`),
  )

  useEffect(() => {
    setSelectedItem(
      tryParse(window.localStorage.getItem(`assetSelected${props.priority}`)),
    )
    setSelectedType(window.localStorage.getItem(`assetType${props.priority}`))
  }, [
    window.localStorage.getItem(`assetType${props.priority}`),
    window.localStorage.getItem(`assetSelected${props.priority}`),
  ])

  const [assetArray, setAssetArray] = useState([])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getSynth = (tokenAddress) =>
    synth.synthDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  useEffect(() => {
    let finalArray = []
    const getArray = () => {
      if (pool.poolDetails) {
        let tempArray = pool.poolDetails.filter(
          (asset) => asset.tokenAddress !== addr.spartav1,
        )

        if (props.whiteList) {
          tempArray = tempArray.filter((asset) =>
            props.whiteList.find((item) => item === asset.tokenAddress),
          )
        }

        if (props.blackList) {
          tempArray = tempArray.filter(
            (asset) =>
              props.blackList.find((item) => asset.tokenAddress === item) ===
              undefined,
          )
        }

        for (let i = 0; i < tempArray.length; i++) {
          // Add only sparta
          if (props.filter?.includes('sparta')) {
            if (tempArray[i].tokenAddress === addr.spartav2) {
              finalArray.push({
                type: 'token',
                icon: (
                  <img
                    height="35px"
                    src={getToken(tempArray[i].tokenAddress)?.symbolUrl}
                    alt={`${
                      getToken(tempArray[i].tokenAddress)?.symbol
                    } asset icon`}
                    className="mr-4"
                  />
                ),
                iconUrl: getToken(tempArray[i].tokenAddress)?.symbolUrl,
                symbol: getToken(tempArray[i].tokenAddress)?.symbol,
                balance: getToken(tempArray[i].tokenAddress)?.balance,
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
                  height="35px"
                  src={getToken(tempArray[i].tokenAddress)?.symbolUrl}
                  alt={`${
                    getToken(tempArray[i].tokenAddress)?.symbol
                  } asset icon`}
                  className="mr-4"
                />
              ),
              iconUrl: getToken(tempArray[i].tokenAddress)?.symbolUrl,
              symbol: getToken(tempArray[i].tokenAddress)?.symbol,
              balance: getToken(tempArray[i].tokenAddress)?.balance,
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
                      height="35px"
                      src={getToken(tempArray[i].tokenAddress)?.symbolUrl}
                      alt={`${
                        getToken(tempArray[i].tokenAddress)?.symbol
                      } LP token icon`}
                      className="mr-4"
                    />
                    <img
                      height="20px"
                      src={spartaIcon}
                      alt={`${
                        getToken(tempArray[i].tokenAddress)?.symbol
                      } LP token icon`}
                      className="position-absolute"
                      style={{ right: '17px', bottom: '2px' }}
                    />
                  </>
                ),
                iconUrl: getToken(tempArray[i].tokenAddress)?.symbolUrl,
                symbol: `${getToken(tempArray[i].tokenAddress)?.symbol}p`,
                balance: tempArray[i].balance,
                address: tempArray[i].tokenAddress,
                actualAddr: tempArray[i].address,
              })
            }
          }

          // Add synth to array
          if (props.filter?.includes('synth')) {
            if (getSynth(tempArray[i].tokenAddress)?.address !== false) {
              finalArray.push({
                type: 'synth',
                iconUrl: getToken(tempArray[i].tokenAddress)?.symbolUrl,
                icon: (
                  <>
                    <img
                      height="35px"
                      src={getToken(tempArray[i].tokenAddress)?.symbolUrl}
                      alt={`${
                        getToken(tempArray[i].tokenAddress)?.symbol
                      } synth icon`}
                      className="mr-4"
                    />
                    <img
                      height="20px"
                      src={spartaIconAlt}
                      alt={`${
                        getToken(tempArray[i].tokenAddress)?.symbol
                      } synth icon`}
                      className="position-absolute"
                      style={{ right: '17px', bottom: '2px' }}
                    />
                  </>
                ),
                symbol: `${getToken(tempArray[i].tokenAddress)?.symbol}s`,
                balance: getSynth(tempArray[i].tokenAddress)?.balance,
                address: tempArray[i].tokenAddress,
                actualAddr: getSynth(tempArray[i].tokenAddress)?.address,
              })
            }
          }
        }
        if (searchInput?.value) {
          finalArray = finalArray.filter((asset) =>
            asset.symbol
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
    pool.poolDetails,
    props.blackList,
    props.filter,
    props.whiteList,
    searchInput?.value,
  ])

  return (
    <>
      <Row
        onClick={() =>
          !props.disabled ? toggleModal() : console.log('button disabled')
        }
        role="button"
        className="justify-content-left"
      >
        <Row className="select-box h-auto" name="singleSelect">
          <Col xs="auto">
            {selectedType === 'token' && (
              <img
                height="35px"
                src={getToken(selectedItem?.tokenAddress)?.symbolUrl}
                alt={`${getToken(selectedItem?.tokenAddress)?.symbol}icon`}
                className="mx-2"
              />
            )}

            {selectedType === 'pool' && (
              <>
                <img
                  height="35px"
                  src={getToken(selectedItem?.tokenAddress)?.symbolUrl}
                  alt={`${getToken(selectedItem?.tokenAddress)?.symbol}icon`}
                  className="mx-2"
                />

                <img
                  height="20px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="position-absolute"
                  style={{ left: '45px', bottom: '-2px' }}
                />
              </>
            )}

            {selectedType === 'synth' && (
              <>
                <img
                  height="35px"
                  src={getToken(selectedItem?.tokenAddress)?.symbolUrl}
                  alt={`${getToken(selectedItem?.tokenAddress)?.symbol}icon`}
                  className="mx-2"
                />

                <img
                  height="20px"
                  src={spartaIconAlt}
                  alt="Sparta LP token icon"
                  className="position-absolute"
                  style={{ left: '45px', bottom: '-2px' }}
                />
              </>
            )}

            <span className="output-card mr-2 ml-1">
              {selectedItem && getToken(selectedItem?.tokenAddress)?.symbol}
              {selectedType === 'pool' && 'p'}
              {selectedType === 'synth' && 's'}
            </span>
            {!props.disabled && (
              <i className="icon-extra-small icon-arrow icon-light align-middle" />
            )}
          </Col>
        </Row>
      </Row>
      <Modal isOpen={showModal} toggle={toggleModal}>
        <Row className="card-body">
          <Col xs="10">
            <h3 className="ml-2 modal-title">{t('selectAnAsset')}</h3>
          </Col>
          <Col xs="2">
            <Button onClick={toggleModal} className="btn btn-transparent mt-4">
              <i className="icon-small icon-close" />
            </Button>
          </Col>
        </Row>
        <Nav className="nav-tabs-custom card-body" pills>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === 'all',
              })}
              onClick={() => {
                changeTab('all')
              }}
            >
              {t('all')}
            </NavLink>
          </NavItem>
          {assetArray.filter((asset) => asset.type === 'token').length > 0 && (
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'token' })}
                onClick={() => {
                  changeTab('token')
                }}
              >
                {' '}
                {t('tokens')}
              </NavLink>
            </NavItem>
          )}
          {assetArray.filter((asset) => asset.type === 'pool').length > 0 && (
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === 'pool',
                })}
                onClick={() => {
                  changeTab('pool')
                }}
              >
                {t('lpTokens')}
              </NavLink>
            </NavItem>
          )}
          {assetArray.filter((asset) => asset.type === 'synth').length > 0 && (
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'synth' })}
                onClick={() => {
                  changeTab('synth')
                }}
              >
                {t('synths')}
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <Row className="card-body pb-0">
          <Col xs="12" className="m-auto">
            <InputGroup>
              <InputGroupAddon
                addonType="prepend"
                role="button"
                tabIndex={-1}
                onKeyPress={() => clearSearch()}
                onClick={() => clearSearch()}
              >
                <InputGroupText>
                  <i
                    className=""
                    role="button"
                    tabIndex={-1}
                    onKeyPress={() => clearSearch()}
                    onClick={() => clearSearch()}
                  />
                  <i className="icon-search-bar icon-close icon-light ml-n3 mt-1" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                autoComplete="off"
                autoCorrect="off"
                className="text-card mt-1"
                placeholder={t('searchAssets')}
                type="text"
                id="searchInput"
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="icon-search-bar icon-search icon-light" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <div className="modal-body">
          <Row className="">
            <Col xs="9" md="9">
              <p className="text-card">Asset</p>
            </Col>
            <Col xs="3" md="3">
              <p className="text-card float-right mr-1">Actions</p>
            </Col>
          </Row>
          {activeTab === 'all' &&
            assetArray.map((asset) => (
              <Row
                key={`${asset.actualAddr}-all`}
                className="mb-3 output-card mr-2"
              >
                <Col xs="auto" className="p-0 pl-2">
                  <div
                    role="button"
                    aria-hidden="true"
                    onClick={() => {
                      addSelection(asset)
                      toggleModal()
                    }}
                  >
                    {asset.icon}
                  </div>
                </Col>

                <Col xs="5" sm="7" className="align-items-center p-0 pl-sm-1">
                  <Row>
                    <Col xs="12" className="float-left ml-n4">
                      <div
                        role="button"
                        aria-hidden="true"
                        onClick={() => {
                          addSelection(asset)
                          toggleModal()
                        }}
                      >
                        {asset.symbol}
                      </div>
                      <div className="description">
                        {formatFromWei(asset.balance)}
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs="3" md="3" className="text-right p-0 pr-2">
                  <Row>
                    <Col xs="6">
                      <ShareLink
                        url={asset.actualAddr}
                        notificationLocation="tc"
                      >
                        <i className="icon-small icon-copy ml-2" />
                      </ShareLink>
                    </Col>
                    <Col xs="6">
                      <div
                        role="button"
                        aria-hidden="true"
                        onClick={() => {
                          dispatch(
                            watchAsset(
                              asset.actualAddr,
                              asset.symbol.includes('-')
                                ? asset.symbol.split('-')[0] +
                                    asset.symbol
                                      .split('-')[1]
                                      .slice(-1)
                                      .toLowerCase()
                                : asset.symbol,
                              '18',
                              asset.symbolUrl,
                            ),
                          )
                        }}
                      >
                        <i className="icon-small icon-metamask icon-light ml-2" />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          {activeTab !== 'all' &&
            assetArray
              .filter((asset) => asset.type === activeTab)
              .map((asset) => (
                <Row
                  key={asset.actualAddr + activeTab}
                  className="mb-3 output-card mr-2"
                >
                  <Col xs="auto" className="p-0 pl-2">
                    <div
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        addSelection(asset)
                        toggleModal()
                      }}
                    >
                      {asset.icon}
                    </div>
                  </Col>

                  <Col xs="5" sm="7" className="align-items-center p-0 pl-sm-1">
                    <Row>
                      <Col xs="12" className="float-left ml-n4">
                        <div
                          role="button"
                          aria-hidden="true"
                          onClick={() => {
                            addSelection(asset)
                            toggleModal()
                          }}
                        >
                          {asset.symbol}
                        </div>
                        <div className="description">
                          {formatFromWei(asset.balance)}
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="3" md="3" className="text-right p-0 pr-2">
                    <Row>
                      <Col xs="6">
                        <ShareLink
                          url={asset.actualAddr}
                          notificationLocation="tc"
                        >
                          <i className="icon-small icon-copy ml-2" />
                        </ShareLink>
                      </Col>
                      <Col xs="6">
                        <div
                          role="button"
                          aria-hidden="true"
                          onClick={() => {
                            dispatch(
                              watchAsset(
                                asset.actualAddr,
                                asset.symbol.includes('-')
                                  ? asset.symbol.split('-')[0] +
                                      asset.symbol
                                        .split('-')[1]
                                        .slice(-1)
                                        .toLowerCase()
                                  : asset.symbol,
                                '18',
                                asset.symbolUrl,
                              ),
                            )
                          }}
                        >
                          <i className="icon-small icon-metamask icon-light ml-2" />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
        </div>
      </Modal>
    </>
  )
}

export default AssetSelect
