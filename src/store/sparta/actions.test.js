import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { getAdjustedClaimRate } from './actions'
// import * as Types from './types'

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Sparta actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('placeholder', async () => {
    expect('1').not.toBe('2')
  })

  // test('should get emitting', async () => {
  //   await getEmitting()(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_EMITTING)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })
})
