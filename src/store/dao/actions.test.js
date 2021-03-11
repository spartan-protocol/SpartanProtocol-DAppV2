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
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_MEMBER_COUNT)
  })

  test('should get a DAO members details', async () => {
    await getDaoMemberDetails(TEST_WALLET)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_MEMBER_DETAILS,
    )
  })

  test('should get DAOs total weight', async () => {
    await getDaoTotalWeight()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_TOTAL_WEIGHT)
  })

  test('should get a DAO members weight', async () => {
    await getDaoMemberWeight(TEST_WALLET)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_DAO_MEMBER_WEIGHT)
  })

  test('should get a DAO members harvestable amount', async () => {
    await getDaoHarvestAmount(TEST_WALLET)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_HARVEST_AMOUNT,
    )
  })

  test('should get a DAO members harvestable amount per era', async () => {
    await getDaoHarvestEraAmount(TEST_WALLET)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_DAO_HARVEST_ERA_AMOUNT,
    )
  })

  test('should deposit LPs in DAO for member', async () => {
    await daoDeposit(TEST_POOL, 1, true)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_DEPOSIT)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe('BalanceErr')
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_ERROR)
    }
  })

  test('should withdraw LPS from DAO for member', async () => {
    await daoWithdraw(TEST_POOL, true)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_WITHDRAW)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'Must have a balance',
      )
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_ERROR)
    }
  })

  test('should perform a harvest for the DAO member', async () => {
    await daoHarvest(true)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.DAO_HARVEST)
  })
})
