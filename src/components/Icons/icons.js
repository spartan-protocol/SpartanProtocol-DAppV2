import React from 'react'
// BRANDS
import { ReactComponent as Apple } from '../../assets/brands/apple-ios.svg'
// FLAGS
import { ReactComponent as TurkeyFlag } from '../../assets/flags/tr.svg'
// ICONS
import { ReactComponent as TxnsHistory } from '../../assets/icons/txns-history.svg'
import { ReactComponent as Analysis } from '../../assets/icons/analysis.svg'
import { ReactComponent as ArrowDown } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowDownUp } from '../../assets/icons/arrow-down-up.svg'
import { ReactComponent as ArrowLeftRight } from '../../assets/icons/arrow-left-right.svg'
import { ReactComponent as ArrowLeft } from '../../assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRight } from '../../assets/icons/arrow-right.svg'
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-up.svg'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import { ReactComponent as Colosseum } from '../../assets/icons/colosseum.svg'
import { ReactComponent as Connect } from '../../assets/icons/connect.svg'
import { ReactComponent as Contract } from '../../assets/icons/contract.svg'
import { ReactComponent as Copy } from '../../assets/icons/copy.svg'
import { ReactComponent as Cycle } from '../../assets/icons/cycle.svg'
import { ReactComponent as Fire } from '../../assets/icons/fire.svg'
import { ReactComponent as Helmet } from '../../assets/icons/helmet.svg'
import { ReactComponent as Home } from '../../assets/icons/home.svg'
import { ReactComponent as IconMissing } from '../../assets/icons/icon-missing.svg'
import { ReactComponent as Info } from '../../assets/icons/info.svg'
import { ReactComponent as List } from '../../assets/icons/list.svg'
import { ReactComponent as Lock } from '../../assets/icons/lock.svg'
import { ReactComponent as MenuOpen } from '../../assets/icons/menu-open.svg'
import { ReactComponent as MenuClose } from '../../assets/icons/menu-close.svg'
import { ReactComponent as Mint } from '../../assets/icons/mint.svg'
import { ReactComponent as Moon } from '../../assets/icons/moon.svg'
import { ReactComponent as Plus } from '../../assets/icons/plus.svg'
import { ReactComponent as Scan } from '../../assets/icons/scan.svg'
import { ReactComponent as Search } from '../../assets/icons/search.svg'
import { ReactComponent as Sun } from '../../assets/icons/sun.svg'
import { ReactComponent as Swap } from '../../assets/icons/swap.svg'
import { ReactComponent as SwapAdd } from '../../assets/icons/swap-add.svg'
import { ReactComponent as Sword } from '../../assets/icons/sword.svg'
import { ReactComponent as Swords } from '../../assets/icons/swords.svg'
import { ReactComponent as Synth } from '../../assets/icons/synth.svg'
import { ReactComponent as Trash } from '../../assets/icons/trash.svg'
import { ReactComponent as Upgrade } from '../../assets/icons/upgrade.svg'
import { ReactComponent as Vault } from '../../assets/icons/vault.svg'
import { ReactComponent as WalletRed } from '../../assets/icons/wallet-red.svg'
// SOCIALS
import { ReactComponent as Discord } from '../../assets/brands/discord.svg'
import { ReactComponent as Gitbook } from '../../assets/brands/gitbook.svg'
import { ReactComponent as Github } from '../../assets/brands/github.svg'
import { ReactComponent as Medium } from '../../assets/brands/medium.svg'
import { ReactComponent as Reddit } from '../../assets/brands/reddit.svg'
import { ReactComponent as Telegram } from '../../assets/brands/telegram.svg'
import { ReactComponent as Twitter } from '../../assets/brands/twitter.svg'
// TOKENS
import { ReactComponent as SpartaV1 } from '../../assets/tokens/spartav1.svg'
import { ReactComponent as SpartaV2 } from '../../assets/tokens/spartav2.svg'
import { ReactComponent as SpartaLP } from '../../assets/tokens/sparta-lp.svg'
import { ReactComponent as SpartaSynth } from '../../assets/tokens/sparta-synth.svg'
import { ReactComponent as Bnb } from '../../assets/tokens/bnb.svg'
import { ReactComponent as Busd } from '../../assets/tokens/busd.svg'
import { ReactComponent as Usd } from '../../assets/tokens/usd.svg'
import { ReactComponent as Usdc } from '../../assets/tokens/usdc.svg'
import { ReactComponent as Usdt } from '../../assets/tokens/usdt.svg'
// WALLETS
import { ReactComponent as BinanceChain } from '../../assets/brands/binance-chain.svg'
import { ReactComponent as Ledger } from '../../assets/brands/ledger.svg'
import { ReactComponent as MathWallet } from '../../assets/brands/math.svg'
import { ReactComponent as MetaMask } from '../../assets/brands/metamask.svg'
import { ReactComponent as TrustWallet } from '../../assets/brands/trust-wallet.svg'
import { ReactComponent as WalletConnect } from '../../assets/brands/walletconnect.svg'

const icons = {
  // BRANDS
  apple: Apple,
  // FLAGS
  turkeyFlag: TurkeyFlag,
  // ICONS
  txnsHistory: TxnsHistory,
  analysis: Analysis,
  arrowDown: ArrowDown,
  arrowDownUp: ArrowDownUp,
  arrowLeftRight: ArrowLeftRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  bin: Trash,
  close: Close,
  colosseum: Colosseum,
  connect: Connect,
  contract: Contract,
  copy: Copy,
  cycle: Cycle,
  fire: Fire,
  helmet: Helmet,
  home: Home,
  iconMissing: IconMissing,
  info: Info,
  list: List,
  lock: Lock,
  menuOpen: MenuOpen,
  menuClose: MenuClose,
  mint: Mint,
  moon: Moon,
  plus: Plus,
  scan: Scan,
  search: Search,
  sun: Sun,
  swap: Swap,
  swapAdd: SwapAdd,
  sword: Sword,
  swords: Swords,
  synth: Synth,
  trash: Trash,
  upgrade: Upgrade,
  vault: Vault,
  walletRed: WalletRed,
  // SOCIALS
  discord: Discord,
  gitbook: Gitbook,
  github: Github,
  medium: Medium,
  reddit: Reddit,
  telegram: Telegram,
  twitter: Twitter,
  // TOKENS
  spartav1: SpartaV1,
  spartav2: SpartaV2,
  spartaLp: SpartaLP,
  spartaSynth: SpartaSynth,
  bnb: Bnb,
  busd: Busd,
  usd: Usd,
  usdc: Usdc,
  usdt: Usdt,
  // WALLETS
  binanceChain: BinanceChain,
  ledger: Ledger,
  mathwallet: MathWallet,
  metamask: MetaMask,
  trustwallet: TrustWallet,
  walletconnect: WalletConnect,
}

/**
 * Get the custom icon from imported list.
 * If placing this inside an OverlayTrigger:
 * make sure you wrap it in span / div or similar
 * @param {string} icon id of the icon requested (required)
 * @param {string} className normal className string (optional)
 * @param {string} size width & height in one (optional)
 * @param {string} height height in px (optional)
 * @param {string} width width in px (optional)
 * @param {string} style (optional)
 * @returns {Component} Custom Icon imported as ReactComponent
 */
export const Icon = (props) => {
  let CustomIcon = icons[props.icon]
  if (CustomIcon === undefined) {
    CustomIcon = icons.iconMissing
  }
  return (
    <>
      <CustomIcon
        className={props.className || ''}
        height={props.size || props.height || '40'}
        width={props.size || props.width || '40'}
        fill={props.fill || 'white'}
        stroke={props.stroke || null}
        style={props.style || null}
        role={props.role || null}
      />
    </>
  )
}
