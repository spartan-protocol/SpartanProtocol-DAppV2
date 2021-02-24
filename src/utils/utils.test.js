import path from 'path';
import {
    getWalletProvider,
    getTokenContract,
    getApproval,
} from "./web3";
import dotenv from "dotenv";
import {
    binanceChainMock,
    ethereumChainMock
} from "./chain.mock";
import {
    deposit
} from "./web3Dao";

dotenv.config({
    path: path.resolve(__dirname, '../.env.test.local'),
});

window.BinanceChain = binanceChainMock;
window.ethereum = ethereumChainMock;

const rpcUrlBc = process.env.REACT_APP_RPC;
const rpcUrlEth = process.env.REACT_APP_RPC_ETH;

describe("Utils", () => {
    test("should get default provider when the wallet is not connected", () => {
        const {
            provider
        } = getWalletProvider();

        expect(provider.connection).toStrictEqual({
            url: rpcUrlBc
        });
    });
    test("should get wallet provider from ethereum globals in the first conection", () => {
        window.sessionStorage.setItem("walletConnected", true);
        const {
            provider
        } = getWalletProvider();

        expect(provider.connection).toStrictEqual({
            url: rpcUrlEth
        });
    });

    test("should get wallet provider from binance chain if it was previously connected with binance", () => {
        window.sessionStorage.setItem("walletConnected", true);
        window.sessionStorage.setItem("lastWallet", "BC");

        const {
            provider
        } = getWalletProvider();

        expect(provider.connection).toStrictEqual({
            url: rpcUrlBc
        });
    });
    test("should get contract", () => {
        const contract = getTokenContract(process.env.REACT_APP_ADDR);

        expect(contract.address).toBe(process.env.REACT_APP_ADDR);
    });
    test("should the contract be approved", async () => {
        const contract = await getApproval(process.env.REACT_APP_ADDR, process.env.REACT_APP_CONTRACT_ADDR);

        expect(contract.hash).toBe("0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b379");
    });

    test("should deposit 1000 coins in a pool", async () => {
        const depositResponse = await deposit("0xa7d9ddbe1f17865597fbd27ec712455208b6b76d", 1000);

        expect(depositResponse.hash).toBe("0xc6a8fa37107ed2bd3d9c07be0c86ff8a83002ab590d296cc3af303f09f68b379");
    });
});