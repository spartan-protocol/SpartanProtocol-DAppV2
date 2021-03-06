import {binanceChainMock, ethereumChainMock} from '../../utils/chain.mock';
import {
    getPart,
    getShare,
    getLiquidityShare,
    getLiquidityUnits,
    getSwapFee,
    getSlipAdustment,
    getAsymmetricShare,
} from './actions';
import * as Types from './types';

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
        await getPart()(dispatchMock);

        console.log(dispatchMock.mock.calls[1][0]);
    })

});