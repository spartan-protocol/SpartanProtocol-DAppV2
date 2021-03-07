import {binanceChainMock, ethereumChainMock} from '../../utils/chain.mock';
import {
    getListedPools,
    getListedPoolsRange,
    getListedAssets,
    getListedAssetsRange,
    getGlobalDetails,
    getTokenDetails,
    getPoolDetails,
    getMemberShare,
    getPoolShare,
    getShareOfBaseAmount,
    getShareOfTokenAmount,
    getPoolShareAssym,
    getPoolAge,
    getPoolROI,
    getPoolAPY,
    isMember,
} from './actions';
import * as Types from './types';

window.BinanceChain = binanceChainMock;
window.ethereum = ethereumChainMock;

describe("Info actions", () => {
    let dispatchMock;

    beforeEach(() => {
        dispatchMock = jest.fn();
    })

    afterEach(() => {
        dispatchMock.mockRestore()
    });

    test("should get listed pools", async ()=> {
        await getListedPools()(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_POOLS',
            payload: [
            '0x7d92c7F898623D8Bb190D17C3491eF3bd8af8796',
            '0x59151Db3Ba8ec50777DA9d6AB316BAF5d15611A8',
            '0x5e8eaB015Cc853825d56B3E723f7a613A6FAFf34',
            '0x7d9Ca6F922fC68Ed16b7eF091898B35CCE38E037',
            '0x59BEB0E29d3e9017a424Ba594c63864bb609DEb1',
            '0x3b3916030e3B9BF3f8202A472e7DD442805cC719'
            ]
        });
    });

    test("should get listed pools according by range", async () => {
        await getListedPoolsRange(1, 2)(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_POOLS_RANGE',
            payload: [
            '0x7d92c7F898623D8Bb190D17C3491eF3bd8af8796',
            '0x59151Db3Ba8ec50777DA9d6AB316BAF5d15611A8',
            ]
        });
    });

    test("should get listed address", async () => {
        await getListedAssets()(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_ASSETS',
            payload: [
                '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
                '0xC6D2d179fB03e951DB72edCcC9491c265b86515A',
                '0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C',
                '0x4Fd9562C5a51514644f7c37139E43d1d82616464',
                '0x90c92451e0D2e439D2ED15bd2C6Ba3B31d42571B',
                '0x6f840f8691E92F1B2dD43924bcbE45350714c7bF'      
            ]
        });
    });

    test("should get listed assets by range", async () => {
        await getListedAssetsRange(1, 3)(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_ASSETS_RANGE',
            payload: [
                '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
                '0xC6D2d179fB03e951DB72edCcC9491c265b86515A',
                '0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C',
            ]
        });
    });

    test("should get global details", async () => {
        await getGlobalDetails()(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_GLOBAL_DETAILS);
    });

    test("should get token details", async () => {
        const token = "0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C";
        await getTokenDetails(token)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_DETAILS);
    });

    test("should get pool details", async () => {
        const pool = "0xC6D2d179fB03e951DB72edCcC9491c265b86515A";
        await getPoolDetails(pool)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_DETAILS);
    });

    test("should get member share", async () => {
        await getMemberShare("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", "0xC6D2d179fB03e951DB72edCcC9491c265b86515A")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_MEMBER_SHARE);
    });

    test("should get pool share", async () => {
        await getPoolShare('0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C', 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE);
    });

    test("should get share of base amount", async () => {
        await getShareOfBaseAmount("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", "0xC6D2d179fB03e951DB72edCcC9491c265b86515A")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE_OF_BASE_AMAOUNT);
    });

    test("should get share of token amount", async () => {
        await getShareOfTokenAmount("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", "0xC6D2d179fB03e951DB72edCcC9491c265b86515A")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE_OF_TOKEN_AMAOUNT);
    });

    test("should get share of pool assym", async () => {
        await getPoolShareAssym("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", 100, 10)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE_ASSYM);
    });

    test("should get pool age", async () => {
        await getPoolAge("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_AGE); 
    });

    test("should get pool roi", async () => {
        await getPoolROI("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_ROI); 
    });

    test("should get pool apy", async () => {
        await getPoolAPY("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_APY); 
    });

    test("should check if is member", async () => {
        await isMember("0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", "0xC6D2d179fB03e951DB72edCcC9491c265b86515A")(dispatchMock);

        expect(dispatchMock).toBeCalledWith({type: 'IS_MEMBER', payload: false});
    });
})