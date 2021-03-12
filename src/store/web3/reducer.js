import { addressesMN, addressesTN } from '../../utils/web3'
import * as Types from './types'

const initialNetwork = JSON.parse(window.localStorage.getItem('network'))

const initialState = {
  addrList: initialNetwork.net === 'testnet' ? addressesTN : addressesMN,
  rpcUrl:
    initialNetwork.net === 'testnet'
      ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      : 'https://bsc-dataseed.binance.org/',
  network: initialNetwork || { chainId: 56, net: 'mainnet', chain: 'BSC' },
  contract: {},
  loading: false,
  error: null,
}

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CHANGE_ADDR_LIST: {
      return {
        ...state,
        addrList: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.CHANGE_RPC_URL: {
      return {
        ...state,
        rpcUrl: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.CHANGE_NETWORK: {
      return {
        ...state,
        network: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_CONTRACT: {
      return {
        ...state,
        contract: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.WEB3_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.WEB3_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    }
    default:
      return state
  }
}
