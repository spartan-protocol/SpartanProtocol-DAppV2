import * as Types from './types'

const initialNetwork = JSON.parse(window.localStorage.getItem('network'))

const initialState = {
  network: initialNetwork || { chainId: 56, net: 'mainnet', chain: 'BSC' },
  contract: {},
  loading: false,
  error: null,
}

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
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
