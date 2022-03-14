import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useHistory } from 'react-router-dom'
import { usePool } from '../../store/pool'
import { BN, formatFromWei } from '../../utils/bigNumber'

import { useWeb3 } from '../../store/web3'

import { Icon } from '../Icons/index'
import HelmetLoading from '../Spinner/index'
import { getAddresses, tempChains, getNetwork } from '../../utils/web3'
import spartaLpIcon from '../../assets/tokens/sparta-lp.svg'

/**
 * An asset selection dropdown. Selection is stored in localStorage under 'assetSelected1' or 'assetSelected2'
 * depending on the 'priority' prop handed over.
 * Can be extended out with 'assetSelected3' etc in the future but the current views will only handle '1' and '2' for now
 * param {uint} priority '1' or '2'
 * param {string} type 'pools' (Shows SP-p related fields)
 * param {array} whiteList tokenAddresses [array]
 * param {array} blackList tokenAddresses [array]
 */
const PoolSelect = () => {
  const { t } = useTranslation()

  const addr = getAddresses()
  const history = useHistory()

  const [showModal, setShowModal] = useState(false)
  const isLightMode = window.localStorage.getItem('theme')
  const pool = usePool()
  const web3 = useWeb3()

  const [trigger0, settrigger0] = useState(0)

  const [network, setnetwork] = useState(getNetwork())

  const [lpsArray, setLpsArray] = useState([])

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const getNet = () => {
    setnetwork(getNetwork())
  }

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  const searchInput = document.getElementById('searchInput')

  const clearSearch = () => {
    searchInput.value = ''
  }

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getPools = () =>
    pool.poolDetails
      .filter((asset) => asset.baseAmount > 0)
      .sort((a, b) => b.baseAmount - a.baseAmount)

  useEffect(() => {
    if (trigger0 === 0) {
      getNet()
    }
    const timer = setTimeout(() => {
      getNet()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    let finalArray = []
    // Add LP token to array

    if (!isLoading()) {
      const tempArray = getPools()
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].address) {
          finalArray.push({
            type: 'pool',
            icon: (
              <>
                <img
                  className="rounded-circle"
                  height="35px"
                  src={getToken(tempArray[i].tokenAddress)?.symbolUrl}
                  alt={`${
                    getToken(tempArray[i].tokenAddress)?.symbol
                  } LP token icon`}
                />
                <img
                  src={spartaLpIcon}
                  height="20px"
                  className="token-badge"
                  alt={`${
                    getToken(tempArray[i].tokenAddress)?.symbol
                  } LP token icon`}
                />
              </>
            ),
            iconUrl: getToken(tempArray[i].tokenAddress)?.symbolUrl,
            symbol: `${getToken(tempArray[i].tokenAddress)?.symbol}p`,
            balance: tempArray[i].balance,
            baseAmount: formatFromWei(
              BN(tempArray[i].baseAmount).times(2).times(web3?.spartaPrice),
              0,
            ),
            address: tempArray[i].tokenAddress,
            actualAddr: tempArray[i].address,
          })
        }
      }
      if (searchInput?.value) {
        finalArray = finalArray.filter((asset) =>
          asset.symbol.toLowerCase().includes(searchInput.value.toLowerCase()),
        )
      }
      setLpsArray(finalArray)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, searchInput?.value])

  return (
    <>
      <Button
        variant={isLightMode ? 'secondary' : 'info'}
        onClick={() => setShowModal(true)}
        className="rounded-pill pe-3 subtitle-label"
      >
        <Icon
          icon="search"
          fill={isLightMode ? 'black' : 'white'}
          size="17"
          className="me-1 mb-1"
        />
        {t('search')}
      </Button>
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          {' '}
          {tempChains.includes(network.chainId) && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{t('searchPools')}</Modal.Title>
              </Modal.Header>
              {!isLoading() ? (
                <Modal.Body>
                  <>
                    <Row className="my-3">
                      <Col xs="12" className="m-auto">
                        <InputGroup>
                          <InputGroup.Text>
                            <Icon size="18" icon="search" xs="18" fill="grey" />
                          </InputGroup.Text>
                          <FormControl
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder={t('searchPools')}
                            type="text"
                            id="searchInput"
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
                    {lpsArray.length > 0 &&
                      lpsArray.map((asset) => (
                        <Row
                          key={asset.actualAddr}
                          className="mb-3 output-card"
                        >
                          <Col xs="2" className="position-relative">
                            <div
                              role="button"
                              aria-hidden="true"
                              onClick={() => {
                                toggleModal()
                              }}
                            >
                              {asset.icon}
                            </div>
                          </Col>
                          <Col xs="4" className="text-end p-0 pe-2">
                            <Row>
                              <Col xs="12" className="float-left ms-n4">
                                <div
                                  role="button"
                                  aria-hidden="true"
                                  onClick={() => {
                                    toggleModal()
                                  }}
                                >
                                  {asset.symbol}
                                </div>
                                <div className="description">
                                  {t('depth')}: &nbsp;${asset.baseAmount}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xs="3" md="3" className="text-end p-0 pe-2">
                            <Button
                              size="xs"
                              variant="info"
                              className="w-100 rounded-pill"
                              onClick={() =>
                                history.push(
                                  `/swap?asset1=${asset.address}&asset2=${addr.spartav2}&type1=token&type2=token`,
                                )
                              }
                            >
                              {t('swap')}
                            </Button>
                          </Col>

                          <Col xs="3" md="3" className="text-end p-0 pe-2">
                            <Button
                              size="xs"
                              variant="info"
                              className="w-100 rounded-pill"
                              onClick={() =>
                                history.push(
                                  `/liquidity?asset1=${asset.address}`,
                                )
                              }
                            >
                              {t('join')}
                            </Button>
                          </Col>
                        </Row>
                      ))}
                  </>
                </Modal.Body>
              ) : (
                <HelmetLoading height={100} width={100} />
              )}
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default PoolSelect
