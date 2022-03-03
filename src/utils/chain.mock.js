import { bscRpcsTN, TEST_WALLET } from './web3'

/* eslint-disable no-unused-vars */
export const binanceChainMock = {
  request: async ({ method, param }) => {
    console.log(`Method ${method}, Param: ${param}`)
    if (method === 'eth_accounts') {
      return [TEST_WALLET]
    }

    if (method === 'eth_call') {
      return '0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b368'
    }

    if (method === 'eth_sendTransaction') {
      return '0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b379'
    }

    if (method === 'eth_getTransactionByHash') {
      return {
        blockHash:
          '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
        blockNumber: '0x5daf3b',
        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
        gas: '0xc350',
        gasPrice: '0x4a817c800',
        hash: '0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b379',
        input: '0x68656c6c6f21',
        nonce: '0x15',
        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
        transactionIndex: '0x41',
        value: '0xf3dbb76162000',
        v: '0x25',
        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
      }
    }

    return 97
  },
  path: bscRpcsTN[0],
}

export const ethereumChainMock = {
  request: async ({ method, param }) => [
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  ],
  path: bscRpcsTN[0],
}
