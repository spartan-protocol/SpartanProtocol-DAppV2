import BinanceChain from "../../assets/icons/BinanceChain.svg"
import MetaMask from "../../assets/icons/MetaMask.svg"
import WalletConnect from "../../assets/icons/WalletConnect.svg"
import TrustWallet from "../../assets/icons/TrustWallet.svg"
import MathWallet from "../../assets/icons/MathWallet.svg"
import TokenPocket from "../../assets/icons/TokenPocket.svg"

const rpcUrl = process.env.REACT_APP_RPC

const walletTypes = [
    {
        id: "BC",
        title: "BinanceChain",
        icon: BinanceChain,
        inject: 'bsc',
    },
    {
        id: "MM",
        title: "MetaMask",
        icon: MetaMask,
        inject: '',
    },
    {
        id: "WC",
        title: "WalletConnect",
        icon: WalletConnect,
        inject: 'walletconnect:' + { rpcUrl },
    },
    {
        id: "TW",
        title: "TrustWallet",
        icon: TrustWallet,
        inject: 'injected',
    },
    {
        id: "MW",
        title: "MathWallet",
        icon: MathWallet,
        inject: 'injected',
    },
    {
        id: "UW",
        title: "Manual",
        icon: TokenPocket,
        inject: 'injected',
    },
];

export default walletTypes;