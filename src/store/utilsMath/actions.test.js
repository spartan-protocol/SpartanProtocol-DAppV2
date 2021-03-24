import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getAddresses, TEST_POOL, TEST_WALLET } from '../../utils/web3'
import {
  getPart,
  getShare,
  getLiquidityShare,
  getLiquidityUnits,
  getSwapFee,
  getSwapOutput,
  getSlipAdustment,
  getAsymmetricShare,
} from './actions'
import * as Types from './types'

const addr = getAddresses()
const BigNumber = require('bignumber.js')

export const BN = BigNumber

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Math core actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('should get part', async () => {
    await getPart(10, 1000)(dispatchMock)

    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_PART)
  })

  test('should get liquidityShare', async () => {
    await getLiquidityShare(
      100,
      addr.wbnb,
      TEST_POOL,
      TEST_WALLET,
    )(dispatchMock)

    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LIQUIDITY_SHARE)
  })

  test('should get liquidity units', async () => {
    await getLiquidityUnits(100, 100, 100, 100, 100)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LIQUIDITY_UNITS)
  })

  test('should get slip adustment', async () => {
    await getSlipAdustment(100, 100, 100, 100)(dispatchMock)

    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SLIP_ADUSTMENT)
  })

  test('should get share', async () => {
    await getShare(100, 100, 100)(dispatchMock)

    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE)
  })

  test('should get swap fee', async () => {
    await getSwapFee(100, 100, 100)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SWAP_FEE)
  })

  test('should get swap out', async () => {
    await getSwapOutput('100', '100', '100')(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SWAP_OUTPUT)
  })

  test('should get asymmetric share out', async () => {
    await getAsymmetricShare(TEST_POOL, TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_ASYMMETRICS_SHARE)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })
})
