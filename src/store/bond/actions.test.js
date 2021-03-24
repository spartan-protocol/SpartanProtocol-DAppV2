import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, TEST_WALLET, getAddresses } from '../../utils/web3'
import {
  getBondListed,
  getBondListedAsset,
  getBondClaimable,
  getBondSpartaRemaining,
  getBondBurnReady,
  getBondListedCount,
  getBondMemberCount,
  getBondMembers,
} from './actions'
import * as Types from './types'

const addr = getAddresses()

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

  test('should get bond listed', async () => {
    await getBondListed()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond listed asset', async () => {
    await getBondListedAsset(TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED_ASSET)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond claimable', async () => {
    await getBondClaimable(
      addr.bond,
      TEST_WALLET,
      '0x0000000000000000000000000000000000000000',
    )(dispatchMock)
    if (dispatchMock.mock.calls[1][0].type === Types.GET_BOND_CLAIMABLE) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    } else {
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.BOND_ERROR)
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe('!listed')
    }
  })

  test('should get bond sparta remaining', async () => {
    await getBondSpartaRemaining()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_SPARTA_REMAINING,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond burn ready', async () => {
    await getBondBurnReady()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_BURN_READY)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond listed count', async () => {
    await getBondListedCount()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED_COUNT)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond member count', async () => {
    await getBondMemberCount()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_MEMBER_COUNT)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get bond members', async () => {
    await getBondMembers()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_MEMBERS)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })
})
