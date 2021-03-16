import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, getAddresses } from '../../utils/web3'
import {
  getPool,
  getTokenCount,
  getTotalPooledValue,
  routerAddLiq,
  routerRemoveLiq,
  routerSwapAssets,
} from './actions'
import * as Types from './types'

const addr = getAddresses()

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

  test('should get the pool', async () => {
    await getPool(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL)
  })

  test('should get token count', async () => {
    await getTokenCount()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_COUNT)
  })

  test('should get total poled', async () => {
    await getTotalPooledValue()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_TOTAL_POOLED_VALUE,
    )
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
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_REMOVE_LIQ)
  })

  test('should be able to swap assets', async () => {
    await routerSwapAssets('10', addr.sparta, TEST_TOKEN, true)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_SWAP_ASSETS)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'iBEP20: transfer from the zero address',
      )
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ERROR)
    }
  })
})
