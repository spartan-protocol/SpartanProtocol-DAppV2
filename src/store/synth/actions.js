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
export const getSynthArray = () => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthFactoryContract()

  try {
    const synthCount = await contract.callStatic.synthCount()
    const tempArray = []
    for (let i = 0; i < synthCount; i++) {
      tempArray.push(contract.callStatic.arraySynths(i))
    }
    const synthArray = await Promise.all(tempArray)
    dispatch(payloadToDispatch(Types.GET_SYNTH_ARRAY, synthArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}
