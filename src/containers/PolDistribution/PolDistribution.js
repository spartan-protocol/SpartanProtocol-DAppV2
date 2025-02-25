import React, { useState } from 'react'
import { polAllocationUsdt } from '../../utils/const/polAllocation'

export const PolDistribution = () => {
  const [walletAddr, setWalletAddr] = useState('')
  const [usdtAllocation, setUsdtAllocation] = useState(null)

  const handleChangedWalletAddr = (e) => {
    setWalletAddr(e.target.value)
  }

  const handleCheckPolAllocation = () => {
    const allocation = polAllocationUsdt[walletAddr.toLowerCase()]
    if (allocation) {
      setUsdtAllocation(`Wallet has ${allocation} USDT allocation`)
    } else {
      setUsdtAllocation(`Wallet not found in the top 100`)
    }
  }

  return (
    <div>
      <h1>POL distribution checker</h1>

      <p>
        Input wallet address to see its USDT allocation. Note that the amounts
        are not yet finalized and subject to change. The wallets however should
        be correct, so if you believe you should be included but are not, please
        reach out in Telegram.
      </p>

      <p>
        Keep in mind if you had less than ~50K combined SPARTA value in your
        wallet, curated pools, or the DaoVault you are likely to not be included
        (thats roughly the cutoff for top 100)
      </p>

      <input
        type="text"
        placeholder="Enter wallet address"
        onChange={handleChangedWalletAddr}
      />

      <button type="button" onClick={handleCheckPolAllocation}>
        Check
      </button>

      {usdtAllocation && <p>{usdtAllocation}</p>}
    </div>
  )
}
