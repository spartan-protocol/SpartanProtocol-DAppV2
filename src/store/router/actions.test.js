import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getPool, getTokenCount, getTotalPooledValue } from './actions'
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

  test('should get the pool', async () => {
    await getPool('0xef95192CC1B7766A06629721Cf8C7169ed34810a')(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL)
  })

  test('should get token count', async () => {
    await getTokenCount()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_COUNT)
  })

  test('should get total poled', async () => {
    await getTotalPooledValue()(dispatchMock)
    console.log(dispatchMock.mock.calls[1][0])
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
    expect(dispatchMock.mock.calls[1][0].type).toBe(
      Types.GET_TOTAL_POOLED_VALUE,
    )
  })
})
