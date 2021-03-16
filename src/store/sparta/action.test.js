import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { BOND_ADDR } from '../../utils/web3Bond'
import { claim, getAdjustedClaimRate, getEmitting } from './actions'
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
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_EMTTING)
  })

  test('should get adjusted claim rate', async () => {
    await getAdjustedClaimRate(BOND_ADDR)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_ADJUSTED_CLAIM_RATE,
    )
  })

  test('should be able to claim from base', async () => {
    await claim(BOND_ADDR, 100, true)(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.CLAIM)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.reason).toBe(
        'iBEP20: transfer from the zero address',
      )
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.SPARTA_ERROR)
    }
  })
})
