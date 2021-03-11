import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, TEST_WALLET } from '../../utils/web3'
import {
  getListedPools,
  getListedPoolsRange,
  getListedAssets,
  getListedAssetsRange,
  getTokenDetails,
  getPoolDetails,
  getMemberShare,
  getPoolShare,
  getShareOfBaseAmount,
  getShareOfTokenAmount,
  getPoolShareAssym,
  getPoolAge,
  getPoolROI,
  getPoolAPY,
  isMember,
} from './actions'
import * as Types from './types'

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Info actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('should get listed pools', async () => {
    await getListedPools()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LISTED_POOLS)
  })

  test('should get listed pools according by range', async () => {
    await getListedPoolsRange(1, 2)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_LISTED_POOLS_RANGE,
    )
  })

  test('should get listed address', async () => {
    await getListedAssets()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LISTED_ASSETS)
  })

  test('should get listed assets by range', async () => {
    await getListedAssetsRange(1, 3)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_LISTED_ASSETS_RANGE,
    )
  })

  test('should get token details', async () => {
    await getTokenDetails(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_DETAILS)
  })

  test('should get pool details', async () => {
    await getPoolDetails(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_DETAILS)
  })

  test('should get member share', async () => {
    await getMemberShare(TEST_TOKEN, TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_MEMBER_SHARE)
  })

  test('should get pool share', async () => {
    await getPoolShare(TEST_TOKEN, 100)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE)
  })

  test('should get share of base amount', async () => {
    await getShareOfBaseAmount(TEST_TOKEN, TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_SHARE_OF_BASE_AMAOUNT,
    )
  })

  test('should get share of token amount', async () => {
    await getShareOfTokenAmount(TEST_TOKEN, TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_SHARE_OF_TOKEN_AMAOUNT,
    )
  })

  test('should get share of pool assym', async () => {
    await getPoolShareAssym(TEST_TOKEN, 1, true)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE_ASSYM)
  })

  test('should get pool age', async () => {
    await getPoolAge(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_AGE)
  })

  test('should get pool roi', async () => {
    await getPoolROI(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_ROI)
  })

  test('should get pool apy', async () => {
    await getPoolAPY(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_APY)
  })

  test('should check if is member', async () => {
    await isMember(TEST_TOKEN, TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.IS_MEMBER)
  })
})
