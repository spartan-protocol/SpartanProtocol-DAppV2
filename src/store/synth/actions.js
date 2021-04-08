import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getSynthFactoryContract } from '../../utils/web3Synth'

export const synthLoading = () => ({
  type: Types.SYNTH_LOADING,
})

/**
 * Get the array of synthAddresses
 * @returns {array} synthArray
 */
export const getSynthArray = (tokenArray) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthFactoryContract()

  try {
    let tempArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      tempArray.push(contract.callStatic.getSynth(tokenArray[i]))
    }
    const synthArray = []
    tempArray = await Promise.all(tempArray)
    for (let i = 0; i < tempArray.length; i++) {
      synthArray.push({
        tokenAddress: tokenArray[i],
        synthAddress:
          tempArray[i] === '0x0000000000000000000000000000000000000000'
            ? false
            : tempArray[i],
      })
    }
    dispatch(payloadToDispatch(Types.GET_SYNTH_ARRAY, synthArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}
