import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getAddresses } from '../../utils/web3'
import {
  // getBasePPinToken,
  getTokenPPinBase,
  // getValueInBase,
  // getValueInToken,
} from './actions'
import * as Types from './types'

const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('UTILS Pricing actions', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
  })

  afterEach(() => {
    dispatchMock.mockRestore()
  })

  test('temp single test', async () => {
    expect('1').not.toBe('2')
  })

  // NEED LIQ IN POOLS FOR THIS TO WORK
  // test('should get the base pp in token', async () => {
  //   await getBasePPinToken(addr.wbnb, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BASE_P_PIN_TOKEN)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  test('should get the token pp in value', async () => {
    await getTokenPPinBase(addr.wbnb, 100)(dispatchMock)
    expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_P_PIN_BASE)
    expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  })

  // NEED LIQ IN POOLS FOR THIS TO WORK
  // test('should get value in base', async () => {
  //   await getValueInBase(addr.wbnb, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_VALUE_IN_BASE)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // NEED LIQ IN POOLS FOR THIS TO WORK
  // test('should get value in token', async () => {
  //   await getValueInToken(addr.wbnb, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_VALUE_IN_TOKEN)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })
})
