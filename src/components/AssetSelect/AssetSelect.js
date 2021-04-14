/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { usePoolFactory } from '../../store/poolFactory'
import { formatFromWei } from '../../utils/bigNumber'
import { watchAsset } from '../../store/web3'
import ShareLink from '../Share/ShareLink'
import MetaMask from '../../assets/icons/MetaMask.svg'
import spartaIcon from '../../assets/img/spartan_red_small.svg'
import spartaIconAlt from '../../assets/img/spartan_white_small.svg'

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
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)

  const [activeTab, setActiveTab] = useState('all')
  const poolFactory = usePoolFactory()

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
    const tempAsset = poolFactory.finalLpArray.filter(
      (i) => i.tokenAddress === asset.address,
    )
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify(tempAsset[0]),
    )
    window.localStorage.setItem(`assetType${props.priority}`, asset.type)
  }

  const selectedItem = JSON.parse(
    window.localStorage.getItem(`assetSelected${props.priority}`),
  )

  const selectedType = window.localStorage.getItem(`assetType${props.priority}`)

  const [assetArray, setAssetArray] = useState([])

  useEffect(() => {
    let finalArray = []
    const getArray = () => {
      if (poolFactory.finalLpArray) {
        let tempArray = poolFactory.finalLpArray

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
            if (tempArray[i].symbol === 'SPARTA') {
              finalArray.push({
                type: 'token',
                icon: (
                  <img
                    height="35px"
                    src={spartaIcon}
                    alt={`${tempArray[i].symbol} asset icon`}
                    className="mr-1"
                  />
                ),
                iconUrl: tempArray[i].symbolUrl,
                symbol: tempArray[i].symbol,
                balance: tempArray[i].balanceTokens,
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
                  src={tempArray[i].symbolUrl}
                  alt={`${tempArray[i].symbol} asset icon`}
                  className="mr-1"
                />
              ),
              iconUrl: tempArray[i].symbolUrl,
              symbol: tempArray[i].symbol,
              balance: tempArray[i].balanceTokens,
              address: tempArray[i].tokenAddress,
              actualAddr: tempArray[i].tokenAddress,
            })
          }

          // Add LP token to array
          if (props.filter?.includes('pool')) {
            if (tempArray[i].poolAddress) {
              finalArray.push({
                type: 'pool',
                icon: (
                  <>
                    <img
                      height="35px"
                      src={tempArray[i].symbolUrl}
                      alt={`${tempArray[i].symbol} LP token icon`}
                      className="mr-n3"
                    />
                    <img
                      height="20px"
                      src={spartaIcon}
                      alt={`${tempArray[i].symbol} LP token icon`}
                      className="mr-1"
                    />
                  </>
                ),
                iconUrl: tempArray[i].symbolUrl,
                symbol: `${tempArray[i].symbol}-SPP`,
                balance: tempArray[i].balanceLPs,
                address: tempArray[i].tokenAddress,
                actualAddr: tempArray[i].poolAddress,
              })
            }
          }

          // Add synth to array
          if (props.filter?.includes('synth')) {
            if (tempArray[i].synthAddress) {
              finalArray.push({
                type: 'synth',
                iconUrl: tempArray[i].symbolUrl,
                icon: (
                  <>
                    <img
                      height="35px"
                      src={tempArray[i].symbolUrl}
                      alt={`${tempArray[i].symbol} synth icon`}
                      className="mr-n3"
                    />
                    <img
                      height="20px"
                      src={spartaIconAlt}
                      alt={`${tempArray[i].symbol} synth icon`}
                      className="mr-1"
                    />
                  </>
                ),
                symbol: `${tempArray[i].symbol}-SPS`,
                balance: tempArray[i].balanceSynths,
                address: tempArray[i].tokenAddress,
                actualAddr: tempArray[i].synthAddress,
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
    poolFactory.finalLpArray,
    props.blackList,
    props.filter,
    props.whiteList,
    searchInput?.value,
  ])

  return (
    <>
      <div onClick={toggleModal} role="button">
        <div className="custom-select h-auto" name="singleSelect">
          {selectedType === 'token' && (
            <img
              height="35px"
              src={selectedItem?.symbolUrl}
              alt={`${selectedItem?.symbol}icon`}
              className="mr-1"
            />
          )}

          {selectedType === 'pool' && (
            <>
              <img
                height="35px"
                src={selectedItem?.symbolUrl}
                alt={`${selectedItem?.symbol}icon`}
                className="mr-n3"
              />

              <img
                height="20px"
                src={spartaIcon}
                alt="Sparta LP token icon"
                className="mr-1"
              />
            </>
          )}

          {selectedType === 'synth' && (
            <>
              <img
                height="35px"
                src={selectedItem?.symbolUrl}
                alt={`${selectedItem?.symbol}icon`}
                className="mr-n3"
              />

              <img
                height="20px"
                src={spartaIconAlt}
                alt="Sparta LP token icon"
                className="mr-1"
              />
            </>
          )}

          {selectedItem && selectedItem?.symbol}
          {selectedType === 'pool' && '-SPP'}
          {selectedType === 'synth' && '-SPS'}
        </div>
      </div>

      <Modal isOpen={showModal} toggle={toggleModal}>
        <Row className="mt-1">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h2" />
                <Row>
                  <Col xs="11">
                    <h2 className="ml-2">Select an asset</h2>
                  </Col>
                  <Col xs="1">
                    <Button
                      style={{
                        right: '16px',
                      }}
                      onClick={toggleModal}
                      className="btn btn-transparent"
                    >
                      <i className="icon-medium icon-close" />
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 'all',
                    })}
                    onClick={() => {
                      changeTab('all')
                    }}
                  >
                    <span className="d-none d-sm-block">All</span>
                  </NavLink>
                </NavItem>
                {assetArray.filter((asset) => asset.type === 'token').length >
                  0 && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 'token' })}
                      onClick={() => {
                        changeTab('token')
                      }}
                    >
                      <span className="d-none d-sm-block">Tokens</span>
                    </NavLink>
                  </NavItem>
                )}
                {assetArray.filter((asset) => asset.type === 'pool').length >
                  0 && (
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'pool',
                      })}
                      onClick={() => {
                        changeTab('pool')
                      }}
                    >
                      <span className="d-none d-sm-block">LP Tokens</span>
                    </NavLink>
                  </NavItem>
                )}
                {assetArray.filter((asset) => asset.type === 'synth').length >
                  0 && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 'synth' })}
                      onClick={() => {
                        changeTab('synth')
                      }}
                    >
                      <span className="d-none d-sm-block">Synths</span>
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <CardBody className="ml-2 mr-2">
                <Row>
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
                          <i className="icon-search-bar icon-close icon-light" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        className="text-card"
                        placeholder="Search assets..."
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
                <Row className="mt-3 mb-3">
                  <Col xs="7">
                    <p className="text-card">Asset</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-card float-right">Balance</p>
                  </Col>
                </Row>
                {activeTab === 'all' &&
                  assetArray.map((asset) => (
                    <Row key={asset.symbol} className="mb-3 output-card">
                      <Col xs="7" className="d-flex align-items-center">
                        <div
                          role="button"
                          onClick={() => {
                            addSelection(asset)
                            toggleModal()
                          }}
                        >
                          {asset.icon}
                          {asset.symbol}
                        </div>
                        <ShareLink
                          url={asset.actualAddr}
                          notificationLocation="tc"
                        >
                          <i className="icon-small icon-copy ml-2" />
                        </ShareLink>
                        <div
                          role="button"
                          onClick={() => {
                            dispatch(
                              watchAsset(
                                asset.actualAddr,
                                asset.symbol.split('-')[0] +
                                  asset.symbol.slice(-1),
                                '18',
                                asset.symbolUrl,
                              ),
                            )
                          }}
                        >
                          <img
                            src={MetaMask}
                            alt="add asset to metamask"
                            height="24px"
                          />
                        </div>
                      </Col>
                      <Col
                        xs="5"
                        className="text-right"
                        style={{ lineHeight: '35px' }}
                        onClick={() => {
                          addSelection(asset)
                          toggleModal()
                        }}
                      >
                        {formatFromWei(asset.balance)}
                      </Col>
                    </Row>
                  ))}
                {activeTab !== 'all' &&
                  assetArray
                    .filter((asset) => asset.type === activeTab)
                    .map((asset) => (
                      <Row key={asset.symbol} className="mb-3 output-card">
                        <Col xs="7" className="d-flex align-items-center">
                          <div
                            role="button"
                            onClick={() => {
                              addSelection(asset)
                              toggleModal()
                            }}
                          >
                            {asset.icon}
                            {asset.symbol}
                          </div>
                          <ShareLink
                            url={asset.actualAddr}
                            notificationLocation="tc"
                          >
                            <i className="icon-small icon-copy ml-2" />
                          </ShareLink>
                          <div
                            role="button"
                            onClick={() => {
                              dispatch(
                                watchAsset(
                                  asset.actualAddr,
                                  asset.symbol.split('-')[0] +
                                    asset.symbol.slice(-1),
                                  '18',
                                  asset.symbolUrl,
                                ),
                              )
                            }}
                          >
                            <img
                              src={MetaMask}
                              alt="add asset to metamask"
                              height="24px"
                            />
                          </div>
                        </Col>
                        <Col
                          xs="5"
                          className="text-right"
                          style={{ lineHeight: '35px' }}
                          onClick={() => {
                            addSelection(asset)
                            toggleModal()
                          }}
                        >
                          {formatFromWei(asset.balance)}
                        </Col>
                      </Row>
                    ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default AssetSelect
