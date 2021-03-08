import {binanceChainMock, ethereumChainMock} from '../../utils/chain.mock';
import {
    getListedPools,
    getListedPoolsRange,
    getListedAssets,
    getListedAssetsRange,
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
            "0xA2C646CF5F55657EC0ecee5b8d2fCcb4cA843bd3",
            "0xef95192CC1B7766A06629721Cf8C7169ed34810a",
            "0xcDf4b29d15f9ffaDa27bd2De6097Eb54EFDe9d75"
            ]
        });
    });

    test("should get listed pools according by range", async () => {
        await getListedPoolsRange(1, 2)(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_POOLS_RANGE',
            payload: [
            '0xA2C646CF5F55657EC0ecee5b8d2fCcb4cA843bd3',
            '0xef95192CC1B7766A06629721Cf8C7169ed34810a'
            ]
        });
    });

    test("should get listed address", async () => {
        await getListedAssets()(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_ASSETS',
            payload: [
                '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
                '0x4102773565d82C8B0785f1262cfe75F04F170777',
                '0xE875aEBD01EfE587487e929cDFF6b52131A513b6'    
            ]
        });
    });

    test("should get listed assets by range", async () => {
        await getListedAssetsRange(1, 3)(dispatchMock);

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: 'GET_LISTED_ASSETS_RANGE',
            payload: [
                '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
                '0x4102773565d82C8B0785f1262cfe75F04F170777'
            ]
        });
    });

    test("should get token details", async () => {
        const token = "0x4102773565d82C8B0785f1262cfe75F04F170777";
        await getTokenDetails(token)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_TOKEN_DETAILS);
    });

    test("should get pool details", async () => {
        const pool = "0x4102773565d82C8B0785f1262cfe75F04F170777";
        await getPoolDetails(pool)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_DETAILS);
    });

    test("should get member share", async () => {
        await getMemberShare("0x4102773565d82C8B0785f1262cfe75F04F170777", "0x0E8196b0EFe6e0062Da1B1d9F03f0a3ab3d53C77")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_MEMBER_SHARE);
    });

    test("should get pool share", async () => {
        await getPoolShare('0x4102773565d82C8B0785f1262cfe75F04F170777', 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE);
    });

    test("should get share of base amount", async () => {
        await getShareOfBaseAmount("0x4102773565d82C8B0785f1262cfe75F04F170777", "0x0E8196b0EFe6e0062Da1B1d9F03f0a3ab3d53C77")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE_OF_BASE_AMAOUNT);
    });

    test("should get share of token amount", async () => {
        await getShareOfTokenAmount("0x4102773565d82C8B0785f1262cfe75F04F170777", "0x0E8196b0EFe6e0062Da1B1d9F03f0a3ab3d53C77")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE_OF_TOKEN_AMAOUNT);
    });

    test("should get share of pool assym", async () => {
        await getPoolShareAssym("0x4102773565d82C8B0785f1262cfe75F04F170777", 100, 10)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_SHARE_ASSYM);
    });

    test("should get pool age", async () => {
        await getPoolAge("0x4102773565d82C8B0785f1262cfe75F04F170777")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_AGE); 
    });

    test("should get pool roi", async () => {
        await getPoolROI("0x4102773565d82C8B0785f1262cfe75F04F170777")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_ROI); 
    });

    test("should get pool apy", async () => {
        await getPoolAPY("0x4102773565d82C8B0785f1262cfe75F04F170777")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_POOL_APY); 
    });

    test("should check if is member", async () => {
        await isMember("0x4102773565d82C8B0785f1262cfe75F04F170777", "0x0E8196b0EFe6e0062Da1B1d9F03f0a3ab3d53C77")(dispatchMock);

        expect(dispatchMock).toBeCalledWith({type: 'IS_MEMBER', payload: false});
    });
})