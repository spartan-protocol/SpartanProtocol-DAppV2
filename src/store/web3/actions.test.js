import { binanceChainMock, ethereumChainMock } from '../../utils/chain.mock'
import { getApproval } from './actions'
import * as Types from './types'
import { getAddresses } from '../../utils/web3'

const addr = getAddresses()

window.BinanceChain = binanceChainMock
window.ethereum = ethereumChainMock

describe('Web3 actions', () => {
  test('the contract should be approved', async () => {
    const dispatchMock = jest.fn()
    await getApproval(addr.sparta, addr.router)(dispatchMock)
    if (dispatchMock.mock.calls[1][0].payload) {
      expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined()
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_APPROVAL)
    } else {
      expect(dispatchMock.mock.calls[1][0].error.body).toContain(
        '{"jsonrpc":"2.0","id":46,"error":{"code":-32000,"message":"missing from address"}}',
      )
      expect(dispatchMock.mock.calls[1][0].type).toBe(Types.WEB3_ERROR)
    }
  }, 10000)
})
