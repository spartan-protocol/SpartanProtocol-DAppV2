import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getSynthContract = (synthAddress) => {
  const abiSynth = getAbis().synth
  const provider = getWalletProvider()
  const contract = new ethers.Contract(synthAddress, abiSynth, provider)
  return contract
}

// GET DAO CONTRACT
export const getSynthFactoryContract = () => {
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider()
  const contract = new ethers.Contract(
    addr.synthFactory,
    abiSynthFactory,
    provider,
  )
  return contract
}
