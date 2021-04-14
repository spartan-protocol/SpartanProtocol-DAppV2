import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { TEST_TOKEN, TEST_WALLET } from '../../utils/web3'
// import { getBondVaultMemberDetails } from './actions'
// import * as Types from './types'

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

  test('placeholder', async () => {
    expect('1').not.toEqual('2')
  })
})
