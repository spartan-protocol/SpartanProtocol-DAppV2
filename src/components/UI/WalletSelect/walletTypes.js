import BinanceChain from "../Svg/WalletIcons/BinanceChain.svg"
import MetaMask from '../Svg/WalletIcons/MetaMask.svg'
import WalletConnect from '../Svg/WalletIcons/WalletConnect.svg'
import TrustWallet from '../Svg/WalletIcons/TrustWallet.svg'
import MathWallet from '../Svg/WalletIcons/MathWallet.svg'
import TokenPocket from '../Svg/WalletIcons/TokenPocket.svg'

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