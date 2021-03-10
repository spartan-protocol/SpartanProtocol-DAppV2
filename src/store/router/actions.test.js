import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN } from '../../utils/web3'
import {
  getPool,
  getTokenCount,
  getTotalPooledValue,
  routerRemoveLiq,
} from './actions'
import * as Types from './types'

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

  // test('should be able to add liquidity', async () => {
  //   await routerAddLiq('0', '10', TEST_TOKEN, true)(dispatchMock)
  //   console.log(dispatchMock.mock.calls[1][0].error)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_ADD_LIQ)
  // })

  test('should be able to remove liquidity', async () => {
    await routerRemoveLiq('100', TEST_TOKEN, true)(dispatchMock)
    console.log(dispatchMock.mock.calls)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_REMOVE_LIQ)
  })

  // test('should be able to swap assets', async () => {
  //   await routerSwapAssets('10', TEST_TOKEN, SPARTA_ADDR, true)(dispatchMock)
  //   console.log(dispatchMock.mock.calls[1][0].error)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.ROUTER_SWAP_ASSETS)
  // })
})
