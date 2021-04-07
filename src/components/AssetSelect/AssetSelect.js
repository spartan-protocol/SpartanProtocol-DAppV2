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
} from 'reactstrap'
import classnames from 'classnames'
import { usePoolFactory } from '../../store/poolFactory'
import { formatFromWei } from '../../utils/bigNumber'

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
  const [showModal, setShowModal] = useState(false)

  const getInitTab = () => {
    if (props.type === 'token') {
      return props.type
    }
    if (props.type === 'pool') {
      return props.type
    }
    return 'all'
  }

  const [activeTab, setActiveTab] = useState(getInitTab())
  const poolFactory = usePoolFactory()

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const changeTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
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
          // Add asset to array
          if (
            props.type === 'token' ||
            props.type === 'sparta' ||
            props.type === 'all'
          ) {
            finalArray.push({
              type: 'token',
              icon: (
                <img
                  src={tempArray[i].symbolUrl}
                  alt={`${tempArray[i].symbol} asset icon`}
                  className="mr-1"
                />
              ),
              symbol: tempArray[i].symbol,
              balance: tempArray[i].balanceTokens,
              address: tempArray[i].tokenAddress,
            })
          }
          // Add LP token to array
          if (props.type === 'pool' || props.type === 'all') {
            if (tempArray[i].poolAddress) {
              finalArray.push({
                type: 'pool',
                icon: (
                  <img
                    src={tempArray[i].symbolUrl}
                    alt={`${tempArray[i].symbol} LP token icon`}
                    className="mr-1"
                  />
                ),
                symbol: `SP-p${tempArray[i].symbol}`,
                balance: tempArray[i].balanceLPs,
                address: tempArray[i].tokenAddress,
              })
            }
          }
          // Add synth to array
          // if (props.type === 'sparta' || props.type === 'all') {
          // if (tempArray[i].synthAddress) {
          //   finalArray.push({
          //     type: 'synth',
          //     icon: (
          //       <img
          //         src={tempArray[i].symbolUrl}
          //         alt={`${tempArray[i].symbol} synth icon`}
          //         className="mr-1"
          //       />
          //     ),
          //     symbol: `SP-s${tempArray[i].symbol}`,
          //     balance: tempArray[i].balanceSynths,
          //     address: tempArray[i].tokenAddress,
          //   })
          // }
          // }
        }

        finalArray = finalArray.sort((a, b) => b.balance - a.balance)
        setAssetArray(finalArray)
      }
    }
    getArray()
  }, [poolFactory.finalLpArray, props.blackList, props.type, props.whiteList])

  return (
    <>
      <Button color="primary" onClick={toggleModal}>
        <img
          className="mr-2"
          src={selectedItem?.symbolUrl}
          alt={`${selectedItem?.symbol}icon`}
        />
        {selectedType === 'pool' && 'SP-p'}
        {selectedType === 'synth' && 'SP-s'}
        {selectedItem && selectedItem?.symbol}
      </Button>

      <Modal isOpen={showModal} toggle={toggleModal}>
        <div className="modal-header justify-content-center">
          <button
            aria-hidden
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            <i className="icon-small icon-close icon-dark" />
          </button>
        </div>

        <Row className="mt-5">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h2">Select an asset</CardTitle>
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
              <CardBody>
                <Row>
                  <Col xs="6">
                    <p>Asset</p>
                  </Col>
                  <Col xs="6">
                    <p>Balance</p>
                  </Col>
                </Row>
                {activeTab === 'all' &&
                  assetArray.map((asset) => (
                    <Row
                      key={asset.symbol}
                      className="mb-1"
                      onClick={() => {
                        addSelection(asset)
                        toggleModal()
                      }}
                    >
                      <Col xs="6">
                        {asset.icon}
                        {asset.symbol}
                      </Col>
                      <Col xs="6">{formatFromWei(asset.balance)}</Col>
                    </Row>
                  ))}
                {activeTab !== 'all' &&
                  assetArray
                    .filter((asset) => asset.type === activeTab)
                    .map((asset) => (
                      <Row
                        key={asset.symbol}
                        className="mb-1"
                        onClick={() => {
                          addSelection(asset)
                          toggleModal()
                        }}
                      >
                        <Col xs="6">
                          {asset.icon}
                          {asset.symbol}
                        </Col>
                        <Col xs="6">{formatFromWei(asset.balance)}</Col>
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
