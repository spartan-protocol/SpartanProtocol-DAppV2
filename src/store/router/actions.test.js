import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN } from '../../utils/web3'
import {
  routerAddLiq,
  routerRemoveLiq,
  // routerSwapAssets,
  // routerAddLiqAsym,
  // routerRemoveLiqAsym,
  // routerSwapBaseToSynth,
  // routerSwapSynthToBase,
  // routerZapLiquidity,
} from './actions'
import * as Types from './types'

// const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Router actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('should be able to add liquidity', async () => {
    await routerAddLiq('10', '10', TEST_TOKEN, true)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ADD_LIQ)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'iBEP20: transfer from the zero address',
      )
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
    }
  })

  test('should be able to remove liquidity', async () => {
    await routerRemoveLiq('100', TEST_TOKEN, true)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].type === Types.ROUTER_REMOVE_LIQ) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    } else {
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'iBEP20: transfer from the zero address',
      )
    }
  })

  // test('should be able to swap assets', async () => {
  //   await routerSwapAssets('10', addr.sparta, TEST_TOKEN)(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].type === Types.ROUTER_SWAP_ASSETS) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })

  // test('should add liquid asymmetrically', async () => {
  //   await routerAddLiqAsym('100', true, TEST_TOKEN)(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].type === Types.ROUTER_ADD_LIQ_ASYM) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })

  // test('should add zap liquidity ', async () => {
  //   await routerZapLiquidity('100', TEST_TOKEN, TEST_TOKEN)(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].type === Types.ROUTER_ZAP_LIQUIDITY) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })

  // test('should remove liquidity asymmetrically', async () => {
  //   await routerRemoveLiqAsym('100', TEST_TOKEN, TEST_TOKEN)(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].type === Types.ROUTER_REMOVE_LIQ_ASYM) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })

  // test('should swap base to synthetic', async () => {
  //   await routerSwapBaseToSynth('100', TEST_TOKEN)(dispatchMock)
  //   if (
  //     dispatchMock.mock.calls[1][0].type === Types.ROUTER_SWAP_BASE_TO_SYNTH
  //   ) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })

  // test('should swap synthetic to base', async () => {
  //   await routerSwapSynthToBase('100', TEST_TOKEN)(dispatchMock)
  //   if (
  //     dispatchMock.mock.calls[1][0].type === Types.ROUTER_SWAP_SYNTH_TO_BASE
  //   ) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.body).toBe(
  //       '{"jsonrpc":"2.0","id":44,"error":{"code":-32000,"message":"missing from address"}}\n',
  //     )
  //   }
  // })
})
