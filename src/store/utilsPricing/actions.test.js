import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
// import { TEST_TOKEN } from '../../utils/web3'
import // getBasePPinToken,
// getTokenPPinBase,
// getValueInBase,
// getValueInToken,
'./actions'
// import * as Types from './types'

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

  // WAIT FOR ESTABLISHED TESTNET WITH CONST POOL ADDR TO USE
  // test('should get the base pp in token', async () => {
  //   await getBasePPinToken(TEST_TOKEN, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_BASE_P_PIN_TOKEN)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // WAIT FOR ESTABLISHED TESTNET WITH CONST POOL ADDR TO USE
  // test('should get the token pp in value', async () => {
  //   await getTokenPPinBase(TEST_TOKEN, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_P_PIN_BASE)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // WAIT FOR ESTABLISHED TESTNET WITH CONST POOL ADDR TO USE
  // test('should get value in base', async () => {
  //   await getValueInBase(TEST_TOKEN, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_VALUE_IN_BASE)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })

  // WAIT FOR ESTABLISHED TESTNET WITH CONST POOL ADDR TO USE
  // test('should get value in token', async () => {
  //   await getValueInToken(TEST_TOKEN, 100)(dispatchMock)
  //   expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_VALUE_IN_TOKEN)
  //   expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
  // })
})
