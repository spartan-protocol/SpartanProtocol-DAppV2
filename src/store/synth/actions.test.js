import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { getAddresses } from '../../utils/web3'
// import { getSynthArray } from './actions'
// import * as Types from './types'

// const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Synth actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('placehodler test', async () => {
    expect('1').not.toEqual('3')
  })
})
