import React, { useState } from 'react'
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
// import { formatFromWei } from '../../utils/bigNumber'
import coinBnb from '../../assets/icons/coin_bnb.svg'
import coinSparta from '../../assets/icons/coin_sparta.svg'
import ReactTable from '../ReactTable/ReactTable'
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
  const [activeTab, setActiveTab] = useState('1')
  const poolFactory = usePoolFactory()

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const changeTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  // const addSelection = (asset) => {
  //   window.localStorage.setItem(
  //     `assetSelected${props.priority}`,
  //     JSON.stringify(asset),
  //   )
  // }

  const selectedItem = JSON.parse(
    window.localStorage.getItem(`assetSelected${props.priority}`),
  )

  const getData = () => {
    console.log('hello')
    if (poolFactory.finalArray) {
      if (!props.whiteList && !props.blackList) {
        poolFactory.finalArray
          .sort((a, b) => b.balanceTokens - a.balanceTokens)
          .map((asset) => ({
            id: asset.tokenAddress,
            token: asset.symbol,
            balance: formatFromWei(asset.balanceTokens),
            // action: <Button onClick={() => addSelection(asset)}>Select</Button>,
          }))
      }
      if (props.whiteList) {
        poolFactory.finalArray
          .filter((asset) =>
            props.whiteList.find((item) => item === asset.tokenAddress),
          )
          .sort((a, b) => b.balanceTokens - a.balanceTokens)
          .map((asset) => ({
            id: asset.tokenAddress,
            token: asset.symbol,
            balance: formatFromWei(asset.balanceTokens),
            // action: <Button onClick={() => addSelection(asset)}>Select</Button>,
          }))
      }
      if (props.blackList) {
        poolFactory.finalArray
          .filter(
            (asset) =>
              props.blackList.find((item) => asset.tokenAddress === item) ===
              undefined,
          )
          .sort((a, b) => b.balanceTokens - a.balanceTokens)
          .map((asset) => ({
            id: asset.tokenAddress,
            token: asset.symbol,
            balance: formatFromWei(asset.balanceTokens),
            // action: <Button onClick={() => addSelection(asset)}>Select</Button>,
          }))
      }
    }
  }

  const [data] = useState(getData())

  console.log(data)

  return (
    <>
      <Button color="primary" onClick={toggleModal}>
        {props.type === 'pools' && <img src={coinSparta} alt="BNB" />}
        <img className="mr-2" src={coinBnb} alt="BNB" />
        {props.type === 'pools' && 'SP-p'}
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
                <CardTitle tag="h2">Select a token</CardTitle>
              </CardHeader>
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      changeTab('1')
                    }}
                  >
                    <span className="d-none d-sm-block">All</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      changeTab('2')
                    }}
                  >
                    <span className="d-none d-sm-block">Tokens</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => {
                      changeTab('3')
                    }}
                  >
                    <span className="d-none d-sm-block">LP Tokens</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '4' })}
                    onClick={() => {
                      changeTab('4')
                    }}
                  >
                    <span className="d-none d-sm-block">Synths</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <CardBody>
                <ReactTable
                  data={data}
                  filterable
                  resizable={false}
                  columns={[
                    // {
                    //   // Header: "Symbol",
                    //   accessor: 'symbol',
                    // },
                    {
                      // Header: "Token",
                      accessor: 'token',
                    },
                    {
                      // Header: "Balance",
                      accessor: 'balance',
                    },
                    // {
                    //   // Header: "Balance",
                    //   accessor: 'action',
                    // },
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default AssetSelect
