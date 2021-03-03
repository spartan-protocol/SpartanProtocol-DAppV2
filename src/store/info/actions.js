import * as Types from './types';
import {getUtilsContract} from '../../utils/web3Utils';
import {payloadToDispatch, errorToDispatch} from '../helpers';

export const getListedPools = () => async dispatch => {
    let contract = getUtilsContract();
    
    try {
        const pools = await contract.allPools();
        dispatch(payloadToDispatch(Types.GET_LISTED_POOLS, pools));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getListedPoolsRange = (first, count) => async dispatch => {
    let contract = getUtilsContract();
    
    try {
        const pools = await contract.poolsInRange(first, count);
        dispatch(payloadToDispatch(Types.GET_LISTED_POOLS_RANGE, pools));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getListedAssets = () => async dispatch => {
    let contract = getUtilsContract();
    
    try {
        const assets = await contract.allTokens();
        dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS, assets));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getListedAssetsRange = (first, count) => async dispatch => {
    let contract = getUtilsContract();
    
    try {
        const assets = await contract.tokensInRange(first, count);
        dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS_RANGE, assets));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getGlobalDetails = () => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let globalDetails = await contract.getGlobalDetails();
        dispatch(payloadToDispatch(Types.GET_GLOBAL_DETAILS, globalDetails));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getTokenDetails = (token) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let tokenDetails = await contract.getTokenDetails(token);
        dispatch(payloadToDispatch(Types.GET_TOKEN_DETAILS, tokenDetails));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolDetails = (pools) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolDetails = await contract.getPoolData(pools);
        dispatch(payloadToDispatch(Types.GET_POOL_DETAILS, poolDetails));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getMemberShare = (token, member) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let memberShare = await contract.getMemberShare(token, member);
        dispatch(payloadToDispatch(Types.GET_MEMBER_SHARE, memberShare));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolShare = (token, units) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolShare = await contract.getPoolShare(token, units);
        dispatch(payloadToDispatch(Types.GET_POOL_SHARE,  poolShare));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getShareOfBaseAmount = (token, member) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let shareOfBaseAmount = await contract.getShareOfBaseAmount(token, member);
        dispatch(payloadToDispatch(Types.GET_SHARE_OF_BASE_AMAOUNT, shareOfBaseAmount));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getShareOfTokenAmount = (token, member) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let shareOfTokenAmount = await contract.getShareOfTokenAmount(token, member);
        dispatch(payloadToDispatch(Types.GET_SHARE_OF_TOKEN_AMAOUNT, shareOfTokenAmount));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolShareAssym = (token, units, toBase) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolShareAssym = await contract.getPoolShareAssym(token, units, toBase);
        dispatch(payloadToDispatch(Types.GET_POOL_SHARE_ASSYM, poolShareAssym));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolAge = (token) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolAge = await contract.getPoolAge(token);
    dispatch(payloadToDispatch(Types.GET_POOL_AGE, poolAge));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolROI = (token) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolROI = await contract.getPoolROI(token);
        dispatch(payloadToDispatch(Types.GET_POOL_ROI, poolROI));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const getPoolAPY = (token) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let poolAPY = await contract.getPoolAPY(token);
        dispatch(payloadToDispatch(Types.GET_POOL_APY, poolAPY));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

export const isMember = (token, member) => async dispatch =>  {
    let contract = getUtilsContract()

    try {
        let result = await contract.isMember(token, member);
        dispatch(payloadToDispatch(Types.IS_MEMBER, result));
    } catch (error) {
        dispatch(errorToDispatch(Types.INFO_ERROR, error));
    }
}

