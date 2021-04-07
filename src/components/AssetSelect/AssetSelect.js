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
    if (props.types?.length !== 1) {
      return 'all'
    }
    return props.types[0]
  }

  const [mode, setMode] = useState(getInitTab())
  const [activeTab, setActiveTab] = useState(getInitTab())
  const poolFactory = usePoolFactory()

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const changeTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const addSelection = (asset) => {
    console.log(asset)
    console.log(poolFactory.finalLpArray)
    const tempAsset = poolFactory.finalLpArray.filter(
      (i) => i.tokenAddress === asset.address,
    )
    console.log(tempAsset)
    window.localStorage.setItem(
      `assetSelected${props.priority}`,
      JSON.stringify(tempAsset[0]),
    )
  }

  const selectedItem = JSON.parse(
    window.localStorage.getItem(`assetSelected${props.priority}`),
  )

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
          // Add LP token to array
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

        if (activeTab !== 'all') {
          finalArray = finalArray.filter((asset) => asset.type === activeTab)
        }

        finalArray = finalArray.sort((a, b) => b.balance - a.balance)
        setAssetArray(finalArray)
      }
    }
    getArray()
  }, [activeTab, poolFactory.finalLpArray, props.blackList, props.whiteList])

  return (
    <>
      <Button color="primary" onClick={toggleModal}>
        <img
          className="mr-2"
          src={selectedItem.symbolUrl}
          alt={`${selectedItem.symbol}icon`}
        />
        {mode === 'pool' && 'SP-p'}
        {selectedItem && selectedItem.symbol}
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
                {props.types?.length > 1 && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 'all' })}
                      onClick={() => {
                        changeTab('all')
                      }}
                    >
                      <span className="d-none d-sm-block">All</span>
                    </NavLink>
                  </NavItem>
                )}
                {props.types?.find((i) => i === 'token') && (
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
                {props.types?.find((i) => i === 'pool') && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 'pool' })}
                      onClick={() => {
                        changeTab('pool')
                      }}
                    >
                      <span className="d-none d-sm-block">LP Tokens</span>
                    </NavLink>
                  </NavItem>
                )}
                {props.types?.find((i) => i === 'synth') && (
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
                {assetArray.map((asset) => (
                  <Row
                    key={asset.symbol}
                    className="mb-1"
                    onClick={() => {
                      addSelection(asset)
                      setMode(asset.type)
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
