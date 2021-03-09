import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getAdjustedClaimRate, getEmitting } from './actions'
import * as Types from './types'

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

  test('should get emitting', async () => {
    await getEmitting()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_EMTTING)
  })

  test('should get adjusted claim rate', async () => {
    await getAdjustedClaimRate('0x696a6B50d7FC6213a566fCC197acced4c4dDefa2')(
      dispatchMock,
    )
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_ADJUSTED_CLAIM_RATE,
    )
  })
})
