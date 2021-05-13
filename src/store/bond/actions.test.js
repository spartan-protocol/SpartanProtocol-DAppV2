import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { TEST_TOKEN } from '../../utils/web3'
// import {
//   // getBondListed,
//   // getBondListedAsset,
//   // getBondClaimable,
//   // getBondSpartaRemaining,
//   // getBondBurnReady,
//   getBondListedCount,
//   // getBondMemberCount,
//   // getBondMembers,
// } from './actions'
// import * as Types from './types'

// const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Bond actions', () => {
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

  // test('should get bond listed', async () => {
  //   await getBondListed()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_LISTED)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond listed asset', async () => {
  //   await getBondListedAsset(TEST_TOKEN)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_LISTED_ASSET)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond claimable', async () => {
  //   await getBondClaimable(
  //     addr.bond,
  //     TEST_WALLET,
  //     '0x0000000000000000000000000000000000000000',
  //   )(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].type === Types.BOND_CLAIMABLE) {
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.reason).toBe('!listed')
  //   }
  // })

  // test('should get bond sparta remaining', async () => {
  //   await getBondSpartaRemaining()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_SPARTA_REMAINING)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond burn ready', async () => {
  //   await getBondBurnReady()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_BURN_READY)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond listed count', async () => {
  //   await getBondListedCount()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_LISTED_COUNT)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond member count', async () => {
  //   await getBondMemberCount()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_MEMBER_COUNT)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get bond members', async () => {
  //   await getBondMembers()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_MEMBERS)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })
})
