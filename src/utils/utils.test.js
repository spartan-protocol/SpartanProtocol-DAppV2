import { getWalletProvider, getAddresses } from './web3'
import { binanceChainMock, ethereumChainMock } from './chain.mock'
import { getTokenContract } from './web3Contracts'

const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Utils', () => {
  test('should get default provider when the wallet is not connected', () => {
    const { connection } = getWalletProvider()

    expect(connection.url).not.toBeUndefined()
  })
  test('should get wallet provider from ethereum globals in the first conection', () => {
    window.sessionStorage.setItem('walletConnected', true)
    const { provider } = getWalletProvider()

    expect(provider.connection.url).not.toBeUndefined()
  })

  test('should get wallet provider from binance chain if it was previously connected with binance', () => {
    window.sessionStorage.setItem('walletConnected', true)
    window.localStorage.setItem('lastWallet', 'BC')

    const { provider } = getWalletProvider()

    expect(provider.connection.url).not.toBeUndefined()
  })
  test('should get contract', () => {
    const contract = getTokenContract(addr.spartav1)

    expect(contract.address).toBe(addr.spartav1)
  })
})
