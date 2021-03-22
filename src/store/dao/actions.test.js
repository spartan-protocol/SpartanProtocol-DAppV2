import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_POOL, TEST_WALLET } from '../../utils/web3'
import {
  getDaoHarvestAmount,
  getDaoHarvestEraAmount,
  getDaoMemberCount,
  getDaoMemberDetails,
  getDaoMemberWeight,
  getDaoTotalWeight,
  daoDeposit,
  daoHarvest,
  daoWithdraw,
  getDaoProposalMajority,
  getDaoProposalQuorum,
  getDaoProposalMinority,
  getDaoProposalDetails,
  getDaoGrantDetails,
  daoProposalNewAction,
  daoProposalNewParam,
  daoProposalNewAddress,
  daoProposalNewGrant,
  daoProposalVote,
  daoProposalRemoveVote,
  daoProposalCancel,
  daoProposalFinalise,
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

  test('should get the DAO member count', async () => {
    await getDaoMemberCount()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_MEMBER_COUNT)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get a DAO members details', async () => {
    await getDaoMemberDetails(TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_MEMBER_DETAILS,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get DAOs total weight', async () => {
    await getDaoTotalWeight()(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_TOTAL_WEIGHT)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get a DAO members weight', async () => {
    await getDaoMemberWeight(TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_MEMBER_WEIGHT)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get a DAO members harvestable amount', async () => {
    await getDaoHarvestAmount(TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_HARVEST_AMOUNT,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get a DAO members harvestable amount per era', async () => {
    await getDaoHarvestEraAmount(TEST_WALLET)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_HARVEST_ERA_AMOUNT,
    )
  })

  test('should deposit LPs in DAO for member', async () => {
    await daoDeposit(TEST_POOL, 1, true)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].type === Types.DAO_DEPOSIT) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe('BalanceErr')
    }
  })

  test('should withdraw LPS from DAO for member', async () => {
    await daoWithdraw(TEST_POOL, true)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].type === Types.DAO_WITHDRAW) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'Must have a balance',
      )
    }
  })

  test('should perform a harvest for the DAO member', async () => {
    await daoHarvest(true)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_HARVEST)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get dao proposal mayority', async () => {
    await getDaoProposalMajority(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_PROPOSAL_MAJORITY,
    )
    expect(dispatchMock.mock.calls[1][0].payload).toBe(false)
  })

  test('should get dao proposal quorum', async () => {
    await getDaoProposalQuorum(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_PROPOSAL_QUORUM,
    )
    expect(dispatchMock.mock.calls[1][0].payload).toBe(false)
  })

  test('should get dao proposal minority', async () => {
    await getDaoProposalMinority(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_PROPOSAL_MINORITY,
    )
    expect(dispatchMock.mock.calls[1][0].payload).toBe(false)
  })

  test('should get dao proposal details', async () => {
    await getDaoProposalDetails(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_PROPOSAL_DETAILS,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get dao grant details', async () => {
    await getDaoGrantDetails(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_GRANT_DETAILS)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create new action proposal', async () => {
    await daoProposalNewAction('BUY')(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.DAO_PROPOSAL_NEW_ACTION,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create new param proposal', async () => {
    await daoProposalNewParam('buy', 'BUY')(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.DAO_PROPOSAL_NEW_PARAM,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create new address proposal', async () => {
    await daoProposalNewAddress(TEST_WALLET, 'SPARTA')(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.DAO_PROPOSAL_NEW_ADDRESS,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create new grant proposal', async () => {
    await daoProposalNewGrant(TEST_WALLET, 100)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.DAO_PROPOSAL_NEW_GRANT,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create new vote proposal', async () => {
    await daoProposalVote(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_PROPOSAL_VOTE)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should create remove vote', async () => {
    await daoProposalRemoveVote(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.DAO_PROPOSAL_REMOTE_VOTE,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should cancel proposal', async () => {
    await daoProposalCancel(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_PROPOSAL_CANCEL)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should finalise proposal', async () => {
    await daoProposalFinalise(1)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_PROPOSAL_FINALISE)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })
})
