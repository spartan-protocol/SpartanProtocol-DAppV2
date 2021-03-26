import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { TEST_WALLET } from '../../utils/web3'
// import {
//   // getDaoVaultMemberPoolWeight,
//   getDaoVaultMemberWeight,
//   getDaoVaultTotalWeight,
// } from './actions'
// import * as Types from './types'

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Dao vault actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('test placeholder', async () => {
    expect('0').not.toBe('2')
  })

  // COME BACK TO THIS ONE LATER
  // test('should get members weight within specific pool', async () => {
  //   await getDaoVaultMemberPoolWeight(TEST_WALLET, TEST_POOL)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_DAOVAULT_MEMBER_POOL_WEIGHT,
  //   )
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get DAOs total weight', async () => {
  //   await getDaoVaultTotalWeight()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_DAOVAULT_TOTAL_WEIGHT,
  //   )
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // test('should get a DAO members weight', async () => {
  //   await getDaoVaultMemberWeight(TEST_WALLET)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(
  //     Types.GET_DAOVAULT_MEMBER_WEIGHT,
  //   )
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })
})
