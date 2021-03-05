import {binanceChainMock, ethereumChainMock} from '../../utils/chain.mock';
import {
    getBasePPinToken,
    getTokenPPinBase,
    getValueInBase,
    getValueInToken,
} from './actions';
import * as Types from './types';

window.BinanceChain = binanceChainMock;
window.ethereum = ethereumChainMock;

describe("Pricing actions", () => {
    let dispatchMock;

    beforeEach(() => {
        dispatchMock = jest.fn();
    })

    afterEach(() => {
        dispatchMock.mockRestore()
    });

    test("should get the base pp in token", async () => {
        await getBasePPinToken("0xC6D2d179fB03e951DB72edCcC9491c265b86515A", 100)(dispatchMock);
        console.log(dispatchMock.mock.calls[0][0]);
        expect(dispatchMock.mock.calls[0][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[0][0].type).toBe(Types.GET_BASE_P_PIN_TOKEN); 
    });

    test("should get the token pp in value", async () => {
        await getTokenPPinBase("0xC6D2d179fB03e951DB72edCcC9491c265b86515A", 100)(dispatchMock);
        console.log(dispatchMock.mock.calls[0][0]);
        expect(dispatchMock.mock.calls[0][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[0][0].type).toBe(Types.GET_TOKEN_P_PIN_BASE); 
    });

    test("should get value in base", async () => {
        await getValueInBase("0xC6D2d179fB03e951DB72edCcC9491c265b86515A", 100)(dispatchMock);
        console.log(dispatchMock.mock.calls[0][0]);
        expect(dispatchMock.mock.calls[0][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[0][0].type).toBe(Types.GET_VALUE_IN_BASE); 
    });

    test("should get value in token", async () => {
        await getValueInToken("0xC6D2d179fB03e951DB72edCcC9491c265b86515A", 100)(dispatchMock);
        console.log(dispatchMock.mock.calls[0][0]);
        expect(dispatchMock.mock.calls[0][0].payload).not.toBeUndefined();
        expect(dispatchMock.mock.calls[0][0].type).toBe(Types.GET_VALUE_IN_TOKEN); 
    });
});