import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { getAddresses } from '../../utils/web3'
import // getListedPools,
// getListedPoolsRange,
// getListedAssets,
// getListedAssetsRange,
// getTokenDetails,
// getPoolDetails,
// getMemberShare,
// getPoolShare,
// getShareOfBaseAmount,
// getShareOfTokenAmount,
// getPoolShareAssym,
// getPoolAge,
// isMember,
'./actions'
// import * as Types from './types'

// const addr = getAddresses()

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

  // // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  //   test('should get listed pools', async () => {
  //     await getListedPools()(dispatchMock)
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LISTED_POOLS)
  //   })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get listed pools according by range', async () => {
  //   await getListedPoolsRange(1, 2)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_LISTED_POOLS_RANGE,
  //   )
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get listed address', async () => {
  //   await getListedAssets()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LISTED_ASSETS)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get listed assets by range', async () => {
  //   await getListedAssetsRange(0, 1)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_LISTED_ASSETS_RANGE,
  //   )
  // })

  // THIS ONE SHOULD WORK???
  // test('should get token details', async () => {
  //   await getTokenDetails(addr.wbnb)(dispatchMock)
  //   console.log(dispatchMock.mock.calls[1][0])
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_DETAILS)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get pool details', async () => {
  //   await getPoolDetails(TEST_TOKEN)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_DETAILS)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get member share', async () => {
  //   await getMemberShare(TEST_TOKEN, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_MEMBER_SHARE)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get pool share', async () => {
  //   await getPoolShare(TEST_TOKEN, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get share of base amount', async () => {
  //   await getShareOfBaseAmount(TEST_TOKEN, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_SHARE_OF_BASE_AMAOUNT,
  //   )
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get share of token amount', async () => {
  //   await getShareOfTokenAmount(TEST_TOKEN, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_SHARE_OF_TOKEN_AMAOUNT,
  //   )
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get share of pool assym', async () => {
  //   await getPoolShareAssym(TEST_TOKEN, 1, true)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE_ASSYM)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should get pool age', async () => {
  //   await getPoolAge(TEST_TOKEN)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_AGE)
  // })

  // NO POOLS YET ENABLE AFTER ESTABLISHED TESTNET
  // test('should check if is member', async () => {
  //   await isMember(TEST_TOKEN, TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.IS_MEMBER)
  // })
})
