import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getApproval } from './actions'
import * as Types from './types'

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Web3 actions', () => {
  test('should the contract be approved', async () => {
    window.sessionStorage.setItem('walletConnected', true)
    window.sessionStorage.setItem('lastWallet', 'BC')
    const dispatchMock = jest.fn()
    await getApproval(
      process.env.REACT_APP_ADDR,
      process.env.REACT_APP_CONTRACT_ADDR,
    )(dispatchMock)

    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_CONTRACT)
    expect(dispatchMock.mock.calls[1][0].payload.hash).toBe(
      '0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b379',
    )
  })
})
