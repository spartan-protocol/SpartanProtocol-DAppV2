import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, TEST_WALLET, BNB_ADDR } from '../../utils/web3'
import { BOND_ADDR } from '../../utils/web3Bond'
import {
  getBondListed,
  getBondListedAsset,
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
    expect(dispatchMock.mock.calls[1][0].payload).toContain(
      '0x0000000000000000000000000000000000000000',
    )
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED)
  })

  test('should get bond listed asset', async () => {
    await getBondListedAsset(TEST_TOKEN)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).toBe(false)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_LISTED_ASSET)
  })

  test('should get bond claimable', async () => {
    await getBondClaimable(BOND_ADDR, TEST_WALLET, BNB_ADDR)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BOND_CLAIMABLE)
  })

  test('should get bond member details', async () => {
    await getBondMemberDetails(BOND_ADDR, TEST_WALLET, TEST_TOKEN)(dispatchMock)
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
    await getBondProposal(1)(dispatchMock)
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
