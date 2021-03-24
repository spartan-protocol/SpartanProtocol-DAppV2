import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { TEST_TOKEN, TEST_WALLET } from '../../utils/web3'
import { getBondVaultMemberDetails } from './actions'
import * as Types from './types'

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Bond vault actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('should get bondvault member details', async () => {
    await getBondVaultMemberDetails(TEST_WALLET, TEST_TOKEN)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_BONDVAULT_MEMBER_DETAILS,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })
})
