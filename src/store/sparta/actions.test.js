import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getAddresses } from '../../utils/web3'
import { getAdjustedClaimRate, getEmitting } from './actions'
import * as Types from './types'

const addr = getAddresses()

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
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_EMITTING)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  test('should get adjusted claim rate', async () => {
    await getAdjustedClaimRate(addr.bond)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_ADJUSTED_CLAIM_RATE,
    )
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  // test('should be able to claim from base', async () => {
  //   await claim(addr.bond, 100, true)(dispatchMock)
  //   if (dispatchMock.mock.calls[1][0].payload) {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.CLAIM)
  //     expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  //   } else {
  //     expect(dispatchMock.mock.calls[1][0].type).toBe(Types.SPARTA_ERROR)
  //     expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
  //       'iBEP20: transfer from the zero address',
  //     )
  //   }
  // })
})
