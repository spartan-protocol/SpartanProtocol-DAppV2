import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getAddresses, TEST_WALLET } from '../../utils/web3'
import {
  getListedPools,
  getListedPoolsRange,
  getTokenDetails,
  getPoolDetails,
  getMemberShare,
  getPoolShare,
  getShareOfBaseAmount,
  getShareOfTokenAmount,
  // getPoolShareAssym,
  getPoolAge,
  isMember,
} from './actions'
import * as Types from './types'

const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Utils actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('temp 1 test', () => {
    expect('1').not.toBe('2')
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

  // test('should get token details', async () => {
  //   await getTokenDetails(addr.wbnb)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_DETAILS)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get pool details', async () => {
  //   await getPoolDetails(addr.wbnb)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_DETAILS)
  // })

  // test('should get member share', async () => {
  //   await getMemberShare(addr.wbnb, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_MEMBER_SHARE)
  // })

  // test('should get pool share', async () => {
  //   await getPoolShare(addr.wbnb, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE)
  // })

  // test('should get share of base amount', async () => {
  //   await getShareOfBaseAmount(addr.wbnb, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_SHARE_OF_BASE_AMAOUNT,
  //   )
  // })

  // test('should get share of token amount', async () => {
  //   await getShareOfTokenAmount(addr.wbnb, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_SHARE_OF_TOKEN_AMAOUNT,
  //   )
  // })

  // CONTRACT NEEDS TO BE UPDATED? FUNCTION USES TOKEN INSTEAD OF POOL
  // test('should get share of pool assym', async () => {
  //   await getPoolShareAssym(addr.wbnb, TEST_WALLET, true)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE_ASSYM)
  // })

  // test('should get pool age', async () => {
  //   await getPoolAge(addr.wbnb)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_AGE)
  // })

  // test('should check if is member', async () => {
  //   await isMember(addr.wbnb, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.IS_MEMBER)
  // })
})
