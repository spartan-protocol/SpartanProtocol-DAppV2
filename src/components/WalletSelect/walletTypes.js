import BinanceChain from '../../assets/icons/BinanceChain.svg'
import MetaMask from '../../assets/icons/MetaMask.svg'
import WalletConnect from '../../assets/icons/WalletConnect.svg'
import TrustWallet from '../../assets/icons/TrustWallet.svg'
import MathWallet from '../../assets/icons/MathWallet.svg'
import TokenPocket from '../../assets/icons/TokenPocket.svg'
import { useWeb3 } from '../../store/web3'

const web3 = useWeb3()

const walletTypes = [
  {
    id: 'BC',
    title: 'BinanceChain',
    icon: [BinanceChain],
    inject: 'bsc',
  },
  {
    id: 'MM',
    title: 'MetaMask',
    icon: [MetaMask],
    inject: '',
  },
  {
    id: 'WC',
    title: 'WalletConnect',
    icon: [WalletConnect],
    inject: `walletconnect:${web3.rpcUrl}`,
  },
  {
    id: 'OT',
    title: 'Others',
    icon: [TokenPocket, MathWallet, TrustWallet],
    inject: 'injected',
  },
]

export default walletTypes
