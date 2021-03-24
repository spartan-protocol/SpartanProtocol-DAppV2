import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { getAddresses, TEST_TOKEN } from '../../utils/web3'
// import {
//   routerAddLiq,
//   routerRemoveLiq,
//   routerSwapAssets,
//   routerAddLiqAsym,
//   routerRemoveLiqAsym,
//   routerSwapBaseToSynth,
//   routerSwapSynthToBase,
//   routerZapLiquidity,
// } from './actions'
// import * as Types from './types'

// const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Pool factory actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('simple placeholder test', async () => {
    expect(0).not.toBe(2)
  })
})
