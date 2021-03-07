import {binanceChainMock, ethereumChainMock} from '../../utils/chain.mock';
import {
    getPart,
    getShare,
    getLiquidityShare,
    getLiquidityUnits,
    getSwapFee,
    getSwapOutput,
    getSlipAdustment,
    getAsymmetricShare,
} from './actions';
import * as Types from "./types";

window.BinanceChain = binanceChainMock;
window.ethereum = ethereumChainMock;

describe("Math core actions", () => {
    let dispatchMock;

    beforeEach(() => {
        dispatchMock = jest.fn();
    })

    afterEach(() => {
        dispatchMock.mockRestore()
    });

    test("should get part", async () => {
        await getPart(10, 1000)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_PART);
    })

    test("should get liquidityShare", async () => {
        await getLiquidityShare(100, "0xbcc27CadA55D4b0baA033e3Ce75C97A8BDc1586C", "0x7d9Ca6F922fC68Ed16b7eF091898B35CCE38E037", "0xC6D2d179fB03e951DB72edCcC9491c265b86515A")(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LIQUIDITY_SHARE);
    });

    test("should get liquidity units", async () => {
        await getLiquidityUnits(100, 100, 100, 100, 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_LIQUIDITY_UNITS);
    });

    test("should get slip adustment", async () => {
        await getSlipAdustment(100, 100, 100, 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SLIP_ADUSTMENT);
    });

    test("shuld get share", async () => {
        await getShare(100, 100, 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SHARE);
    });

    test("should get swap fee", async () => {
        await getSwapFee(100,100,100)(dispatchMock);
        ;

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SWAP_FEE);
    });

    test("should get swap out", async () => {
        await getSwapOutput(100,100,100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_SWAP_OUTPUT);
    });

    test("should get asymmetric share out", async () => {
        await getAsymmetricShare(100, 100, 100)(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
        expect(dispatchMock.mock.calls[1][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[1][0].type).toBe(Types.GET_ASYMMETRICS_SHARE);
    });

});