import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, TEST_WALLET, TEST_POOL } from '../../utils/web3'
import {
  getBondListed,
  getBondListedAsset,
  getBondDepositEstimate,
  getBondClaimable,
  getBondMemberDetails,
  getBondSpartaRemaining,
  getBondBurnReady,
  getBondProposalCount,
  getBondProposal,
  getBondProposals,
  getBondCoolOffPeriod,
} from './actions'
import * as Types from './types'

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
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).toStrictEqual([
      '0x0000000000000000000000000000000000000000',
      '0x90c92451e0D2e439D2ED15bd2C6Ba3B31d42571B',
      '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      '0x07dc3a8cD1B54CDFd55d223Ca15863dcA6B70C1A',
      '0xb0bbC81b0769A57079E01FE1333E060e7Cd438Aa',
    ])
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED)
  })

  test('should get bond listed asset', async () => {
    await getBondListedAsset(TEST_TOKEN)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).toBe(false)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED_ASSET)
  })

  test('should get bond deposit estimate', async () => {
    await getBondDepositEstimate(TEST_TOKEN, 1000)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_DEPOSIT_ESTIMATED,
    )
  })

  test('should get bond claimable', async () => {
    await getBondClaimable(TEST_WALLET, TEST_POOL, TEST_TOKEN)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_CLAIMABLE)
  })

  test('should get bond member details', async () => {
    await getBondMemberDetails(TEST_WALLET, TEST_POOL, TEST_TOKEN)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_MEMBER_DETAILS,
    )
  })
  test('should get bond sparta remaining', async () => {
    await getBondSpartaRemaining()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_SPARTA_REMAINING,
    )
  })

  test('should get bond burn ready', async () => {
    await getBondBurnReady()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_BURN_READY)
  })

  test('should get bond proposal count', async () => {
    await getBondProposalCount()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_PROPOSAL_COUNT,
    )
  })

  test('should get bond proposal', async () => {
    await getBondProposal(405504)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_PROPOSAL)
  })

  test('should get bond proposals', async () => {
    await getBondProposals()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_PROPOSALS)
  })

  test('should get bond cool off period', async () => {
    await getBondCoolOffPeriod()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BOND_COOL_OFF_PERIOD,
    )
  })
})
