import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { polAllocationUsdt } from '../../utils/const/polAllocation'
import { useApp } from '../../store/app'
import { getPolDistroContract } from '../../utils/getContracts'
import { merkleInfo } from './merkleInfo'

export const PolDistribution = () => {
  const { address } = useAccount()
  const { chainId } = useApp()
  const { data: walletClient } = useWalletClient(chainId)

  const [checkAddress, setCheckAddress] = useState('')
  const [checkUsdtAllocation, setCheckUsdtAllocation] = useState(null)

  const handleCheckPolAllocation = () => {
    const allocation = polAllocationUsdt[checkAddress.toLowerCase()]
    if (allocation) {
      setCheckUsdtAllocation(`Wallet has ${allocation} USDT allocation`)
    } else {
      setCheckUsdtAllocation(`Wallet not found in the snapshot`)
    }
  }

  const handleChangedCheckedWalletAddr = (e) => {
    setCheckAddress(e.target.value)
  }

  const [connectedMerkleInfo, setConnectedMerkleInfo] = useState({
    index: null,
    amount: null,
    proof: null,
  })
  const [claimCutoffTimestamp, setClaimCutoffTimestamp] = useState(null)
  const [connectedHasClaimed, setConnectedHasClaimed] = useState(false)

  useEffect(() => {
    const polDistroContract = getPolDistroContract()
    if (polDistroContract) {
      polDistroContract.read
        .endTime()
        .then((timestamp) => {
          setClaimCutoffTimestamp(timestamp.toString())
        })
        .catch((error) => {
          console.error('Error fetching claim cutoff timestamp:', error)
        })
    }
  }, [chainId])

  useEffect(() => {
    if (address) {
      const merkleInfoArray = Object.keys(merkleInfo.claims).map((key) => ({
        wallet: key.toLowerCase(),
        index: merkleInfo.claims[key].index,
        amount: merkleInfo.claims[key].amount,
        proof: merkleInfo.claims[key].proof,
      }))
      const _merkleInfo = merkleInfoArray.find(
        (info) => info.wallet === address.toLowerCase(),
      )
      setConnectedMerkleInfo({
        index: _merkleInfo?.index || null,
        amount: _merkleInfo?.amount || null,
        proof: _merkleInfo?.proof || null,
      })
    }
  }, [address, chainId])

  useEffect(() => {
    if (connectedMerkleInfo) {
      const polDistroContract = getPolDistroContract()
      if (polDistroContract) {
        polDistroContract.read
          .isClaimed([connectedMerkleInfo.index])
          .then((claimed) => {
            setConnectedHasClaimed(claimed)
          })
          .catch((error) => {
            console.error('Error checking claim status:', error)
          })
      }
    }
  }, [connectedMerkleInfo, chainId])

  const handleClaimPolAllocation = () => {
    const polDistroContract = getPolDistroContract(
      walletClient,
      undefined,
      chainId,
    )
    if (polDistroContract) {
      polDistroContract.write
        .claim([
          connectedMerkleInfo.index,
          address,
          connectedMerkleInfo.amount,
          connectedMerkleInfo.proof,
        ])
        .then((tx) => {
          console.log('Claim transaction:', tx)
        })
        .catch((error) => {
          console.error('Error claiming POL allocation:', error)
        })
    } else {
      console.error('POL distribution contract not found')
    }
  }

  return (
    <div className="col gap-16">
      <div>
        <h1>POL distribution checker</h1>
        <p>
          Input wallet address to see its USDT allocation. Note that the amounts
          are not yet finalized and subject to change. The wallets however
          should be correct, so if you believe you should be included but are
          not, please reach out in Telegram.
        </p>
        <p>
          Keep in mind if you had less than ~50K combined SPARTA value in your
          wallet, curated pools, or the DaoVault you are not likely to be
          included.
        </p>
        <input
          type="text"
          placeholder="Enter wallet address"
          onChange={handleChangedCheckedWalletAddr}
        />
        <button type="button" onClick={handleCheckPolAllocation}>
          Check
        </button>
        {checkUsdtAllocation && <p>{checkUsdtAllocation}</p>}
      </div>
      {chainId === 97 && (
        <>
          <div>--------------------------</div>
          <div className="col gap-16">
            <h1>Testnet POL distribution claim</h1>
            <p>
              You can claim now up until{' '}
              <span title={`${claimCutoffTimestamp} UTC`}>
                {claimCutoffTimestamp
                  ? new Date(claimCutoffTimestamp * 1000).toDateString()
                  : ''}
              </span>
              . After that, the claim contract will be closed and you will not
              be able to claim.
            </p>
            <div>Connected wallet: {address}</div>
            {connectedMerkleInfo.proof && (
              <div>
                <div>Claim amount: {connectedMerkleInfo.amount} USDT</div>
                <div>Claim index: {connectedMerkleInfo.index}</div>
                <div style={{ overflowWrap: 'anywhere' }}>
                  Claim proof: {connectedMerkleInfo.proof}
                </div>
              </div>
            )}
            <div>Claim cutoff timestamp: {claimCutoffTimestamp} UTC</div>
            <div>
              Need testnet BNB for gas? Go to:
              https://www.bnbchain.org/en/testnet-faucet
            </div>
            <button
              type="button"
              onClick={handleClaimPolAllocation}
              disabled={!connectedMerkleInfo.proof || connectedHasClaimed}
            >
              Claim POL allocation
            </button>
            {connectedHasClaimed && (
              <div>
                <strong>
                  🥳Connected wallet has already claimed its POL distro
                  allocation!
                </strong>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
