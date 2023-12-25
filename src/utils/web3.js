import { createPublicClient, decodeEventLog, getAddress, http } from 'viem'
import { bsc, bscTestnet } from 'viem/chains'

// Testnet ABI Imports
import axios from 'axios'
import abiTnBondVault from '../ABI/TN/BondVault.json'
import abiTnDao from '../ABI/TN/Dao.json'
import abiTnDaoVault from '../ABI/TN/DaoVault.json'
import abiTnErc20 from '../ABI/TN/ERC20.json'
import abiTnFS from '../ABI/TN/FallenSpartans.json'
import abiTnPool from '../ABI/TN/Pool.json'
import abiTnPoolFactory from '../ABI/TN/PoolFactory.json'
import abiTnReserve from '../ABI/TN/Reserve.json'
import abiTnRouter from '../ABI/TN/Router.json'
import abiTnSparta from '../ABI/TN/Sparta.json'
import abiTnSSUtils from '../ABI/TN/SpartanSwapUtils.json'
import abiTnSynth from '../ABI/TN/Synth.json'
import abiTnSynthFactory from '../ABI/TN/SynthFactory.json'
import abiTnSynthVault from '../ABI/TN/SynthVault.json'
import abiTnUtils from '../ABI/TN/Utils.json'
import abiTnWbnb from '../ABI/TN/WBNB.json'

// Mainnet ABI Imports
import abiMnBondVault from '../ABI/MN/BondVault.json'
import abiMnDao from '../ABI/MN/Dao.json'
import abiMnDaoVault from '../ABI/MN/DaoVault.json'
import abiMnErc20 from '../ABI/MN/ERC20.json'
import abiMnFS from '../ABI/MN/FallenSpartans.json'
import abiMnPool from '../ABI/MN/Pool.json'
import abiMnPoolFactory from '../ABI/MN/PoolFactory.json'
import abiMnReserve from '../ABI/MN/Reserve.json'
import abiMnRouter from '../ABI/MN/Router.json'
import abiMnSparta from '../ABI/MN/Sparta.json'
import abiMnSSUtils from '../ABI/MN/SpartanSwapUtils.json'
import abiMnSynth from '../ABI/MN/Synth.json'
import abiMnSynthFactory from '../ABI/MN/SynthFactory.json'
import abiMnSynthVault from '../ABI/MN/SynthVault.json'
import abiMnUtils from '../ABI/MN/Utils.json'
import abiMnWbnb from '../ABI/MN/WBNB.json'
import { BN } from './bigNumber'

export const abisTN = {
  bondVault: abiTnBondVault.abi,
  dao: abiTnDao.abi,
  daoVault: abiTnDaoVault.abi,
  erc20: abiTnErc20.abi,
  fallenSpartans: abiTnFS.abi,
  pool: abiTnPool.abi,
  poolFactory: abiTnPoolFactory.abi,
  reserve: abiTnReserve.abi,
  router: abiTnRouter.abi,
  sparta: abiTnSparta.abi,
  ssUtils: abiTnSSUtils.abi,
  synth: abiTnSynth.abi,
  synthFactory: abiTnSynthFactory.abi,
  synthVault: abiTnSynthVault.abi,
  utils: abiTnUtils.abi,
  wbnb: abiTnWbnb.abi,
}

export const abisMN = {
  bondVault: abiMnBondVault.abi,
  dao: abiMnDao.abi,
  daoVault: abiMnDaoVault.abi,
  erc20: abiMnErc20.abi,
  fallenSpartans: abiMnFS.abi,
  pool: abiMnPool.abi,
  poolFactory: abiMnPoolFactory.abi,
  reserve: abiMnReserve.abi,
  router: abiMnRouter.abi,
  sparta: abiMnSparta.abi,
  ssUtils: abiMnSSUtils.abi,
  synth: abiMnSynth.abi,
  synthFactory: abiMnSynthFactory.abi,
  synthVault: abiMnSynthVault.abi,
  utils: abiMnUtils.abi,
  wbnb: abiMnWbnb.abi,
}

// ADDRESSES FOR TESTS (UPDATE WHENEVER TESTS POINT SOMEWHERE ELSE)
export const TEST_WALLET = '0x0E8196b0EFe6e0062Da1B1d9F03f0a3ab3d53C77'
export const TEST_TOKEN = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
export const TEST_POOL = '0x48963a679e6708a39A166343FE289dbE9aBaEfeF'

export const addressesTN = {
  // OLD ADDRESSES SPV1
  bondv1: '0x4551457647f6810a917AF70Ca47252BbECD2A36c',
  bondv2: '0x2021047F7E3F8c9882e502A63eF036daEFA0B5f6',
  bondv3: '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836',
  daov1: '0xbC6134840a2604D00222F276c16d143dd3666dA3',
  incentivev1: '0xc241d694d51db9e934b147130cfefe8385813b86',
  routerv1: '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3',
  routerv2a: '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35',
  routerv2b: '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50',
  routerv2c: '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50',
  utilsv1: '0x4029A4173F9431763Ee68F5BfCF0C6aA703B1653',
  // OLD ADDRESSES SPV2
  bondv4: '0xFbaCb851716FFA718111f069937cDbCF7003B384',
  bondVaultv1: '0x7f06678Bf6199CdEF6Cf76C264b94ffA6CD22e40',
  daov2: '0x0dFA75B8e76101aDBf588A4C03653f59DE3D4B23',
  daoVaultv1: '0x2d53adc5e5acc92226FAaFf1a5FcdEf4fEFAA4DD',
  fallenSpartansv1: '0x0Facf7AD25Ce97F174Cd1E7664fD1b8867C3909b',
  migratev1: '0x197C0fc4Ea92b58f375De66647368862677C95B7',
  poolFactoryv1: '0x47621301afa9FC76d61d6c34f96636D95a788142',
  reservev1: '0xaCb7645eb7784ee421dE0b4C4e2D31bbE29d3bD7',
  routerv3: '0xC9B60E2b1Fa28CeA42fD6f25D76766e1D5908eF2',
  synthFactoryv1: '0x18f48fB0881B263B26266B4db2bF034fEe7a2b43',
  synthVaultv1: '0x8db384Ee61F6F56750e64f8011dD3e323d885d2C',
  utilsv2: '0x7c5bBc0A7E21c22936f3788F5d58fB732659B76E',
  // LAST TN ADDRESSES
  bondVault11: '0x91A0862f8fb5B9b430BF634720114c7173A1D0FC', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  dao11: '0x4F45fB8C7cFeAFeFA4B9159F92396dC19B437517', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  daoVault11: '0x7f5E5A443001D85d9f7a13E566fD9E1423B6Eac8', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  poolFactory11: '0x88B0A87189d140EfD460D5A1b9b8Cbc77F2910E5', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  reserve11: '0xf5aB990cdC7B69717AA378A76eB8538F71318478', // 1d882f10adf42b4e2696ff9868b0e27226d5f370 ???
  router11: '0x20e41Cc498CF27efD62EBFAD9B633Ad7a45bDC48', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  synthFactory11: '0x16e6c2ba0A0d90203Cc592Ff1E6776f3dd0C6e4f', // 56c9c1dd3d25f5545cb8194b4095b4a49087c460
  synthVault11: '0x30cDEA06826836145c9203b1D4d54e321Cc32B1f', // 9170b11ac4ce8b424f44aa5d503bdb7b0e85b4be
  utils11: '0x1C7437c145bD0bb7EE0dcFD30434173893596ee1', // f2bb6131c8ae2c8242c9f72a4d49cdf29bf19771
  // CURRENT ADDRESSES
  bondVault: '0xF935EF68dda8d0bc7bfD10738f761C5675d15A54', // a8307cd3719fdde58ec43ee20f2aa0f606c1a607
  dao: '0x590A77bD2E439E0B3e2C4cCdBB3d4fe5313D5915', // 0c94dee8ec91410e65b8f7c9c5b8b5f58ba3a152
  daoVault: '0x802B266388D54eb00CaE497F03C83fc05173AD56', // a8307cd3719fdde58ec43ee20f2aa0f606c1a607
  fallenSpartans: '0x0Facf7AD25Ce97F174Cd1E7664fD1b8867C3909b', // N/A
  poolFactory: '0xd2637bc90B2362Bb1A45A9660E7aFdC9bB1a92DF', // a8307cd3719fdde58ec43ee20f2aa0f606c1a607
  reserve: '0x29f8e4CA0bF807F99DCEeBDbbC8e0d2332517565', //
  router: '0x77b063DBC2F3449964ff26b59EA8F87C64E575d6', // 18030c29e010d283c4e86c28087bea4509f3f6c8
  synthFactory: '0x53f98fb6BC812A06A830e7faa7Cd7c7D417933C1', // a8307cd3719fdde58ec43ee20f2aa0f606c1a607
  synthVault: '0xf3Bbc814e74a32BD283Ba9c8009170d37182438B', // a8307cd3719fdde58ec43ee20f2aa0f606c1a607
  utils: '0x7Ed2B0611308C75C10d5FC34cDA75749e6a6Df7D', // 5c079a33ed87ff5f7286d2a034a78db62660c9ab
  ssUtils: '0xB7B3216A199893aC00486Fe30439A8F4388fF4C9',
  // TOKEN ADDRESSES
  bnb: '0x0000000000000000000000000000000000000000',
  wbnb: '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
  spartav1: '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB',
  spartav2: '0xd055ADFdD53963F578A929eaA440DBED95407472',
  busdp: '0xd861414a977a25CbeDcb7167A171c0d129Ca55ba',
}

// List of BSC Mainnet Addresses
export const addressesMN = {
  // OLD ADDRESSES SPV1
  bondv1a: '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da',
  bondv1b: '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf', // ACTUALLY V2
  bondv1c: '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43', // ACTUALLY V3
  daov1: '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0',
  incentivev1: '0xdbe936901aeed4718608d0574cbaab01828ae016',
  routerv1a: '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5',
  routerv1b: '0xDbe936901aeed4718608D0574cbAAb01828AE016',
  routerv1c: '0x9dB88952380c0E35B95e7047E5114971dFf20D07',
  routerv1d: '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D',
  utilsv1: '0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91',
  tempUtilsv1a: '0x20d0270649c9f13c081FF98350148706A05557F8',
  // OLD ADDRESSES SPV2 (pre-actual mainnet)
  daoPAM: '0xaa1977d313C265982F24c59D49a35F0aB6F8C7bB',
  fallenSpartansPAM: '0xfEB0a2A1AE523E4786f6916ff00E037fF82Ab1A6',
  reservePAM: '0x5304c4449b51ff774D0557cFACDbA6fF35DB33C1',
  // OLD ADDRESSES SPV2 (post mainnet)
  bondVaultv2a: '0x518F746Ab25432146f15f583845cFe3F56d2Bb1c', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  daov2a: '0x80531284f27d8b479aCA8dbA18fD6303B4bF1567', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  daoVaultv2a: '0x4102773565d82C8B0785f1262cfe75F04F170777', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  fallenSpartansv2a: '0xfEB0a2A1AE523E4786f6916ff00E037fF82Ab1A6', // EARLIER; CHECK
  poolFactoryv2a: '0x2C577706579E08A88bd30df0Fd7A5778A707c3AD', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  reservev2a: '0x5aB5bbe3044E58303A189d3D28f6da31e9217F9F', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  routerv2a: '0x03662D8347aC1487e01FCE1CA679e8484ef954a3', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  synthFactoryv2a: '0x8b2643D95DeaD636EC3ba5F720809541c3355f4e', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  synthVaultv2a: '0xa6C3288C18505D134445cB4Fe8499da22002F1E0', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  utilsv2a: '0x82b67e7A325def377f62401126cc54eEE73719ec', // 48f7fc6a3788a625dc1858e95c316cda679f8f81
  // CURRENT ADDRESSES
  bondVault: '0x518F746Ab25432146f15f583845cFe3F56d2Bb1c', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  dao: '0x80531284f27d8b479aCA8dbA18fD6303B4bF1567', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  daoVault: '0x4102773565d82C8B0785f1262cfe75F04F170777', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  fallenSpartans: '0xfEB0a2A1AE523E4786f6916ff00E037fF82Ab1A6', // EARLIER; CHECK
  poolFactory: '0x2C577706579E08A88bd30df0Fd7A5778A707c3AD', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  reserve: '0xe548561782c2F4f1145B654A41C47F49159913B0', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  router: '0xf73d255d1E2b184cDb7ee0a8A064500eB3f6b352', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  synthFactory: '0x6514C010b8096BC565766949A93f1C370cdf9f38', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  synthVault: '0xa6C3288C18505D134445cB4Fe8499da22002F1E0', // 62a39b71f43fc8f59ab5a58dba6f590f5a82e8b6
  utils: '0xFC7eAd29ee55EabEC54dBc38bd03852e1fF46D50', // b5afabc003ffe041de6fe552106c8fc526031a5b
  ssUtils: '0x3B599Dd050a10D224195A921a172fFDB50D9B559',
  // TOKEN ADDRESSES
  bnb: '0x0000000000000000000000000000000000000000',
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  spartav1: '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C',
  spartav2: '0x3910db0600eA925F63C36DdB1351aB6E2c6eb102',
  busdp: '0xa0Ab4b300E2cCD801178B28e5De0a8F24614B54c',
}

export const bscRpcsTN = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/', // GOOD - 27JUNE22
  // 'https://data-seed-prebsc-2-s1.binance.org:8545/', // BAD - 27JUNE22
  'https://data-seed-prebsc-1-s2.binance.org:8545/', // GOOD - 27JUNE22
  'https://data-seed-prebsc-2-s2.binance.org:8545/', // GOOD - 27JUNE22
  'https://data-seed-prebsc-1-s3.binance.org:8545/', // NEUTRAL - 27JUNE22 (Working, but 20K+ Blocks behind)
  // 'https://data-seed-prebsc-2-s3.binance.org:8545/', // BAD - 27JUNE22
]

export const bscRpcsMN = [
  // Main RPCs
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed1.ninicoin.io/',
  // BACKUPS BELOW
  'https://bsc-dataseed2.defibit.io/',
  'https://bsc-dataseed3.defibit.io/',
  'https://bsc-dataseed4.defibit.io/',
  'https://bsc-dataseed2.ninicoin.io/',
  'https://bsc-dataseed3.ninicoin.io/',
  'https://bsc-dataseed4.ninicoin.io/',
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://bsc-dataseed3.binance.org/',
  'https://bsc-dataseed4.binance.org/',
  'https://rpc.ankr.com/bsc',
  'https://bscrpc.com',
  'https://binance.nodereal.io',
  // ENV conditionals - Make sure conditional RPCs are not the first index of this array
  process.env.NODE_ENV === 'production'
    ? 'https://bsc-mainnet.nodereal.io/v1/cf893e692ffa45098367d6c47fb3ff11' // Permissioned to the SP domain (whitelist)
    : process.env.REACT_APP_NODEREAL_PRIVATE,
]

export const stablecoinPools = [
  '0x511d2fB8458eb46eCcAEeaeAE722cCe769aAe779', // USDTp Mainnet
  '0xa0Ab4b300E2cCD801178B28e5De0a8F24614B54c', // BUSDp Mainnet
  '0xa7a6816323d2521e263B6fBE58cDdEAd41Ea12a7', // USDCp Mainnet
]

export const synthTokensMN = [
  '0x0000000000000000000000000000000000000000', // BNB Mainnet
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD Mainnet
  '0x55d398326f99059fF775485246999027B3197955', // USDT Mainnet
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC Mainnet
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BTCB Mainnet
]

export const synthTokensTN = [
  '0x0000000000000000000000000000000000000000', // BNB Testnet
  '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSD Testnet
  '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867', // DAI Testnet
]

export const getSynthTokens = (chainId) => {
  if (chainId === 56) {
    return synthTokensMN
  }
  if (chainId === 97) {
    return synthTokensTN
  }
  return [] // fallback to no synths
}

export const exCuratedPools = [
  // This is for pools that were previous Curated but are not Curated anymore.
  // Handy for things like the DaoVault where a no-longer-curated asset may still be
  // staked and will still need to show up in the DaoVault (so users can withdraw etc)
  '0x972C7278ECFdCF97556F9C53075576a8bC6547ab',
  '0x511d2fB8458eb46eCcAEeaeAE722cCe769aAe779',
  '0xa0Ab4b300E2cCD801178B28e5De0a8F24614B54c',
  '0xa7a6816323d2521e263B6fBE58cDdEAd41Ea12a7',
  '0xCc80f0f3746B4561dd7e6e7Da4b8Cda2FfEbC15a',
]

export const deadAddress = '0x000000000000000000000000000000000000dEaD'
export const liveChains = [97, 56] // Protocol supported chains - use this wherever having an incomplete mainnet is okay
export const tempChains = [97, 56] // Currently enabled chains - use this when we need to avoid calling an incomplete mainnet
export const oneWeek = 604800 // change to 604800 for mainnet
export const synthHarvestLive = false // Have this as 'false' until the synth claim % is set to prevent users harvesting accidentally & resetting their timer

export const getTwAssetId = (tokenAddr) => {
  const _tokenAddr = getAddress(tokenAddr)
  if (tokenAddr.length > 0) {
    return `c20000714_t${_tokenAddr}`
  }
  return false
}

export const getTwTokenInfo = async (tokenAddr) => {
  const assetID = getTwAssetId(tokenAddr)
  if (assetID) {
    try {
      const apiUrl = `https://api.trustwallet.com/v1/assets/${assetID}`
      const result = await axios.get(apiUrl).then((r) => r.data)
      if (!result || !result.asset_id) {
        return false
      }
      const info = result
      return info
    } catch (err) {
      console.log(err)
      return false
    }
  }
  return false
}

const blacklist = [] // add array of addresses here to cause fallback token icon to display

export const getTwTokenLogo = async (tokenAddr, chainId) => {
  const tokenInfo = false
  if (chainId === 56) {
    if ([addressesMN.bnb, addressesMN.wbnb].includes(tokenInfo.symbol)) {
      return `${window.location.origin}/images/icons/BNB.svg`
    }
    if (!blacklist.includes(tokenAddr)) {
      return `https://raw.githubusercontent.com/spartan-protocol/assets/master/blockchains/smartchain/assets/${tokenAddr}/logo.png`
    }
  }
  return `${window.location.origin}/images/icons/Fallback.svg`
}

/**
 * Format long string into a string with '...' separator (ideally for anchor text)
 * @param {string} longString
 * @returns {string} shortString
 */
export const formatShortString = (longString) => {
  const addr = longString || '0x000000000000000'
  const shortString = `${addr.substring(0, 5)}...${addr?.substring(
    addr.length - 3,
    addr.length,
  )}`
  return shortString
}

/**
 * Trigger change between Addresses
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} Relevant list of addresses
 */
export const changeAddresses = (_chainId) => {
  const addresses = _chainId === 97 ? addressesTN : addressesMN
  window.localStorage.setItem('sp_addresses', JSON.stringify(addresses))
  return addresses
}

const tryParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return false
  }
}

/**
 * Check localStorage for addresses and set default if missing
 * @returns {Object} Relevant list of addresses
 */
export const getAddresses = () =>
  tryParse(window.localStorage.getItem('sp_addresses')) ?? changeAddresses()

/**
 * Filter finalArray (or any array) to the scope of the assetAddress
 * @param {string} assetAddress
 * @param {string} finalArray
 * @returns {Object} item from finalArray
 */
export const getItemFromArray = (asset, finalArray) => {
  const addr = getAddresses()
  let arrayItem = finalArray.filter(
    (item) => item.tokenAddress === addr.spartav2,
  )
  if (finalArray.find((item) => item.tokenAddress === asset.tokenAddress)) {
    arrayItem = finalArray.filter(
      (item) => item.tokenAddress === asset.tokenAddress,
    )
  }
  ;[arrayItem] = arrayItem
  return arrayItem
}

/**
 * Trigger change between ABIs
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} Relevant list of ABIs
 */
export const changeAbis = (_chainId) => {
  const abis = _chainId === 97 ? abisTN : abisMN
  window.localStorage.setItem('sp_abis', JSON.stringify(abis))
  return abis
}

/**
 * Check localStorage for ABIs and set default if missing
 * @returns {Object} Relevant list of ABIs
 */
export const getAbis = () =>
  tryParse(window.localStorage.getItem('sp_abis')) ?? changeAbis(56)

/**
 * Trigger random selection of a relevant RPC URL
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} RPC URL
 */
export const changeRpcNew = (rpcUrls) => {
  const minBlock = rpcUrls[0].block - 9
  const rpcs = rpcUrls.filter((x) => x.block >= minBlock)
  return rpcs
}

/**
 * Trigger random selection of a relevant RPC URL
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} RPC URL
 */
export const changeRpc = (_chainId, rpcUrls) => {
  let rpcs = _chainId === 97 ? bscRpcsTN : bscRpcsMN
  if (rpcUrls) {
    rpcs = changeRpcNew(rpcUrls)
  }
  const rpcIndex = Math.floor(Math.random() * rpcs.length)
  const rpcUrl = rpcs[rpcIndex]
  return rpcUrl
}

/**
 * Trigger change between mainnet and testnet
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const changeChainId = (_chainId) => {
  changeAbis(_chainId)
  changeAddresses(_chainId)
  window.localStorage.setItem('sp_chainId', _chainId)
  return _chainId
}

/**
 * Check localStorage for net and set default if missing
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const getChainId = () => {
  let network = window.localStorage.getItem('sp_chainId')
  network = network ? parseInt(network, 10) : changeChainId(56)
  return network
}

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = (_provider, rpcUrls) => {
  const chainId = getChainId()
  let client = createPublicClient({
    chain: chainId === 97 ? bscTestnet : bsc,
    transport: http(changeRpc(chainId, rpcUrls).url),
  }) // simple public provider unsigned
  if (_provider) client = _provider
  return client
}

// // GET GAS PRICE FROM PROVIDER
// export const getProviderGasPrice = (rpcUrls) => {
//   // const provider = getWalletProvider(null, rpcUrls) // TEMP DISABLE
//   // const gasPrice = provider.getGasPrice() // TEMP DISABLE
//   const lsSettings = getSettings()
//   const isMN = getChainId() === 56
//   const gasPrice = isMN ? lsSettings.gasRateMN : lsSettings.gasRateTN
//   return BN(gasPrice).times(1000000000).toString()
// }

/**
 * Get the 'window' object of the connected walletType
 * @param {} - uses localStorage
 * @returns {Object} window.ethereum or BinanceChain
 */
export const getWalletWindowObj = () => {
  let connectedWalletType = ''
  if (window.sessionStorage.getItem('lastWallet') === 'BC') {
    connectedWalletType = window.BinanceChain
  } else {
    connectedWalletType = window.ethereum
  }
  return connectedWalletType
}

const mergeAbis = (abiArray) => {
  const masterAbi = []
  for (let i = 0; i < abiArray.length; i++) {
    for (let ii = 0; ii < abiArray[i].length; ii++) {
      masterAbi.push(abiArray[i][ii])
    }
  }
  return masterAbi
}

/** Parse raw txn's logs before localStorage */
const parseTxnLogs = (txn, txnType) => {
  const addr = getAddresses()
  const member = txn.from
  // get the list of ABIs
  let abiArray = abisMN
  if (getChainId === 97) {
    abiArray = abisTN
  }
  // BOND.TXN TYPES
  // if (txnType === 'bondDeposit') {
  //   const log = txn.logs[txn.logs.length - 1]
  //   // Dao.DepositAsset event (owner, tokenAddress, poolAddress, depositAmount, bondedLP) *** NEEDS CHECKING ***
  //   const bondLog = decodeEventLog({ abi: abiArray.dao, ...log }).args
  //   return {
  //     txnHash: txn.transactionHash,
  //     txnIndex: txn.transactionIndex,
  //     txnType,
  //     txnTypeIcon: txnType,
  //     sendAmnt1: bondLog.depositAmount.toString(),
  //     sendToken1: bondLog.tokenAddress,
  //     send1: member,
  //     recAmnt1: bondLog.bondedLP.toString(),
  //     recToken1: bondLog.poolAddress,
  //     rec1: 'BondVault',
  //   }
  // }
  if (txnType === 'bondClaim') {
    const log = txn.logs[txn.logs.length - 1]
    // BondVault.Claimed (owner, poolAddress, amount) *** NEEDS CHECKING ***
    const claimLog = decodeEventLog({ abi: abiArray.bondVault, ...log }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: claimLog.amount.toString(),
      sendToken1: claimLog.poolAddress,
      send1: 'BondVault',
      recAmnt1: claimLog.amount.toString(),
      recToken1: claimLog.poolAddress,
      rec1: member,
    }
  }
  // DAO.TXN TYPES
  if (txnType === 'daoDeposit') {
    let log3 = txn.logs[txn.logs.length - 1]
    // DAO.MemberDeposits event (member, pool, amount)
    log3 = decodeEventLog({ abi: abiArray.dao, ...log3 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: log3.amount.toString(),
      sendToken1: log3.pool,
      send1: member,
      recAmnt1: log3.amount.toString(),
      recToken1: log3.pool,
      rec1: 'DaoVault',
    }
  }
  if (txnType === 'daoWithdraw') {
    let log1 = txn.logs[txn.logs.length - 1]
    // DAO.MemberWithdraws event (member, pool, balance)
    log1 = decodeEventLog({ abi: abiArray.dao, ...log1 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: log1.balance.toString(),
      sendToken1: log1.pool,
      send1: 'DaoVault',
      recAmnt1: log1.balance.toString(),
      recToken1: log1.pool,
      rec1: member,
    }
  }
  if (txnType === 'daoHarvest') {
    const log = txn.logs[txn.logs.length - 1]
    // Dao.Harvest (owner, amount)
    const harvestLog = decodeEventLog({ abi: abiArray.dao, ...log }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: harvestLog.amount.toString(),
      sendToken1: addr.spartav2,
      send1: 'Reserve',
      recAmnt1: harvestLog.amount.toString(),
      recToken1: addr.spartav2,
      rec1: member,
    }
  }
  // DAO.PROP_TXN TYPES
  if (txnType === 'newProposal') {
    let log0 = txn.logs[0] // DaoFee SPARTA.Transfer event (from, to, value)
    let log1 = txn.logs[1] // FeeBurn SPARTA.Transfer event (from, to, value)
    let log3 = txn.logs[txn.logs.length - 1] // DAO.NewProposal event (member, proposalID, proposalType)
    log0 = decodeEventLog({ abi: abiArray.erc20, ...log0 }).args
    log1 = decodeEventLog({ abi: abiArray.erc20, ...log1 }).args
    log3 = decodeEventLog({ abi: abiArray.dao, ...log3 }).args
    const fee1 = log0.value.toString()
    const fee2 = log1.value.toString()
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: BN(fee1).plus(fee2).toString(),
      sendToken1: addr.spartav2,
      send1: member,
      rec1: `Proposal:#${log3.proposalID}`,
    }
  }
  if (txnType === 'voteProposal') {
    let log0 = txn.logs[txn.logs.length - 1]
    // DAO.NewVote event (member, proposalID, proposalType)
    log0 = decodeEventLog({ abi: abiArray.dao, ...log0 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Proposal:#${log0.proposalID}`,
    }
  }
  if (txnType === 'removeVoteProposal') {
    let log0 = txn.logs[txn.logs.length - 1]
    // DAO.RemovedVote event (member, proposalID, proposalType)
    log0 = decodeEventLog({ abi: abiArray.dao, ...log0 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Proposal:#${log0.proposalID}`,
    }
  }
  if (txnType === 'pollVotes') {
    let log0 = txn.logs[txn.logs.length - 1]
    // DAO.ProposalFinalising event (member, proposalID, timeFinalised, proposalType)
    log0 = decodeEventLog({ abi: abiArray.dao, ...log0 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Proposal:#${log0.proposalID}`,
    }
  }
  if (txnType === 'cancelProposal') {
    let log0 = txn.logs[txn.logs.length - 1]
    // DAO.CancelProposal event (member, proposalID)
    log0 = decodeEventLog({ abi: abiArray.dao, ...log0 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Proposal:#${log0.proposalID}`,
    }
  }
  if (txnType === 'finaliseProposal') {
    let log0 = txn.logs[txn.logs.length - 1]
    // DAO.FinalisedProposal event (member, proposalID, proposalType)
    log0 = decodeEventLog({ abi: abiArray.dao, ...log0 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Proposal:#${log0.proposalID}`,
    }
  }
  // POOL.TXN TYPES
  if (txnType === 'createPool') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.poolFactory,
      abiArray.pool,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // PoolFactory.CreatePool event (token, pool)
    const createLog = logs.filter((x) => x.name === 'CreatePool')[0].args
    // Pool.AddLiquidity event (member, tokenAddress, inputBase, inputToken, unitsIssued) *** NEEDS CHECKING ***
    const liqLog = logs.filter((x) => x.name === 'AddLiquidity')[0].args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: liqLog.inputBase.toString(),
      sendToken1: addr.spartav2,
      send1: member,
      sendAmnt2: liqLog.inputToken.toString(),
      sendToken2: liqLog.tokenAddress,
      send2: member,
      recAmnt1: liqLog.unitsIssued.toString(),
      recToken1: createLog.pool,
      rec1: member,
    }
  }
  // ROUTER.TXN TYPES
  if (txnType === 'addLiq') {
    let log = txn.logs[txn.logs.length - 1]
    const poolAddr = log.address
    // Pool.AddLiquidity event (member, tokenAddress, inputBase, inputToken, unitsIssued)
    log = decodeEventLog({ abi: abiArray.pool, ...log }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: log.inputBase.toString(),
      sendToken1: addr.spartav2,
      send1: member,
      sendAmnt2: log.inputToken.toString(),
      sendToken2: log.tokenAddress,
      send2: member,
      recAmnt1: log.unitsIssued.toString(),
      recToken1: poolAddr,
      rec1: member,
    }
  }
  if (txnType === 'addLiqSingle') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.AddLiquidity event (member, tokenAddress, inputBase, inputToken, unitsIssued)
    const liqIndex = logs.findIndex((x) => x.name === 'AddLiquidity')
    const poolAddr = txn.logs[liqIndex].address
    const liqLog = logs[liqIndex].args
    // Token.Transfer event (1st one to the Pool * 2 is ~input) (from, to, value)
    const tsfIndex = logs.findIndex(
      (x) => x.name === 'Transfer' && x.args.to === poolAddr,
    )
    const sendToken1 = txn.logs[tsfIndex].address
    const tsfLog = logs[tsfIndex].args
    const halfInput = tsfLog.value.toString()
    const inputAmnt = BN(halfInput).times(2)
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: inputAmnt.toString(),
      sendToken1,
      send1: member,
      recAmnt1: liqLog.unitsIssued.toString(),
      recToken1: poolAddr,
      rec1: member,
    }
  }
  if (txnType === 'zapLiq') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.sparta,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.RemoveLiquidity event (member, tokenAddress, outputBase, outputToken, unitsClaimed) *** NEEDS CHECKING ***
    const remIndex = logs.findIndex((x) => x.name === 'RemoveLiquidity')
    const remAddr = txn.logs[remIndex].address
    const remLog = logs[remIndex].args
    // Pool.AddLiquidity event (member, tokenAddress, inputBase, inputToken, unitsIssued) *** NEEDS CHECKING ***
    const addIndex = logs.findIndex((x) => x.name === 'AddLiquidity')
    const addAddr = txn.logs[addIndex].address
    const addLog = logs[addIndex].args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: remLog.unitsClaimed.toString(),
      sendToken1: remAddr,
      send1: member,
      recAmnt1: addLog.unitsIssued.toString(),
      recToken1: addAddr,
      rec1: member,
    }
  }
  if (txnType === 'remLiq') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.RemoveLiquidity event (member, tokenAddress, outputBase, outputToken, unitsClaimed) *** NEEDS CHECKING ***
    const remIndex = logs.findIndex((x) => x.name === 'RemoveLiquidity')
    const poolAddr = txn.logs[remIndex].address
    const remLog = logs[remIndex].args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,

      sendAmnt1: remLog.unitsClaimed.toString(),
      sendToken1: poolAddr,
      send1: member,

      recAmnt1: remLog.outputBase.toString(),
      recToken1: addr.spartav2,
      rec1: member,

      recAmnt2: remLog.outputToken.toString(),
      recToken2: remLog.tokenAddress,
      rec2: member,
    }
  }
  if (txnType === 'remLiqSingle') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.router,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.Swapped (tokenFrom, tokenTo, recipient, inputAmount, outputAmount, fee)
    const swapIndex = logs.findIndex((x) => x.name === 'Swapped')
    const swapLog = logs[swapIndex].args
    const poolAddr = txn.logs[swapIndex].address
    const toBase = swapLog.tokenTo === addr.spartav2
    const _out1 = swapLog.outputAmount.toString()
    // Pool.RemoveLiquidity event (member, tokenAddress, outputBase, outputToken, unitsClaimed) *** NEEDS CHECKING ***
    const remLiqLog = logs.filter((x) => x.name === 'RemoveLiquidity')[0].args
    const _baseOut = remLiqLog.outputBase.toString()
    const _tokenOut = remLiqLog.outputToken.toString()
    const _out2 = toBase ? _baseOut : _tokenOut
    // Output sum (not inc feeBurn for SPARTA)
    const recAmnt1 = BN(_out1).plus(_out2)
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: remLiqLog.unitsClaimed.toString(),
      sendToken1: poolAddr,
      send1: member,
      recAmnt1: recAmnt1.toString(),
      recToken1: swapLog.tokenTo,
      rec1: member,
    }
  }
  if (txnType === 'swapped') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.router,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    const swapLogs = logs.filter((x) => x.name === 'Swapped')
    const doubleSwap = swapLogs.length > 1
    // Pool.Swapped (tokenFrom, tokenTo, recipient, inputAmount, outputAmount, fee)
    const swapLog1 = swapLogs[0].args
    let swapLog2 = []
    if (doubleSwap) {
      // Pool.Swapped (tokenFrom, tokenTo, recipient, inputAmount, outputAmount, fee)
      swapLog2 = swapLogs[1].args
    }
    const { tokenFrom } = swapLog1
    const { inputAmount } = swapLog1
    let { tokenTo } = swapLog1
    let { outputAmount } = swapLog1
    if (doubleSwap) {
      tokenTo = swapLog2.tokenTo
      outputAmount = swapLog2.outputAmount
    }
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: inputAmount.toString(),
      sendToken1: tokenFrom,
      send1: member,
      recAmnt1: outputAmount.toString(),
      recToken1: tokenTo,
      rec1: member,
    }
  }
  if (txnType === 'mintSynth') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.router,
      abiArray.synthVault,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.Swapped (tokenFrom, tokenTo, recipient, inputAmount, outputAmount, fee)
    let fromBase = true
    let swapLog = logs.filter((x) => x.name === 'Swapped')
    if (swapLog.length > 0) {
      fromBase = false
      swapLog = swapLog[0].args
    }
    // Pool.MintSynth (member, synthAddress, baseAmount, liqUnits, synthAmount) *** NEEDS CHECKING ***
    const mintLog = logs.filter((x) => x.name === 'MintSynth')[0].args
    const sendAmnt1 = fromBase ? mintLog.baseAmount : swapLog.inputAmount
    const sendToken1 = fromBase ? addr.spartav2 : swapLog.tokenFrom
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: sendAmnt1.toString(),
      sendToken1,
      send1: member,
      recAmnt1: mintLog.synthAmount.toString(),
      recToken1: mintLog.synthAddress,
      rec1: 'SynthVault',
    }
  }
  if (txnType === 'burnSynth') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.pool,
      abiArray.router,
      abiArray.sparta,
      abiArray.wbnb,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Pool.Swapped (tokenFrom, tokenTo, recipient, inputAmount, outputAmount, fee)
    let toBase = true
    let swapLog = logs.filter((x) => x.name === 'Swapped')
    if (swapLog.length > 0) {
      toBase = false
      swapLog = swapLog[0].args
    }
    // Pool.BurnSynth (member, synthAddress, baseAmount, liqUnits, synthAmount) *** NEEDS CHECKING ***
    const burnLog = logs.filter((x) => x.name === 'BurnSynth')[0].args
    const recAmnt1 = toBase ? burnLog.baseAmount : swapLog.outputAmount
    const recToken1 = toBase ? addr.spartav2 : swapLog.tokenTo
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: burnLog.synthAmount.toString(),
      sendToken1: burnLog.synthAddress,
      send1: member,
      recAmnt1: recAmnt1.toString(),
      recToken1,
      rec1: member,
    }
  }
  if (txnType === 'unfreeze') {
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: `Try Unfreeze`,
    }
  }
  // SPARTA.TXN TYPES
  if (txnType === 'upgrade') {
    const masterAbi = mergeAbis([abiArray.erc20, abiArray.sparta])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // Spartav1.Transfer (Tsf In) (from, to, value)
    const sendAmnt1 = logs[0].args.value
    // Spartav2.Transfer (Upgraded) (from, to, value)
    const recAmnt1 = logs[2].args.value
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: sendAmnt1.toString(),
      sendToken1: addr.spartav1,
      send1: member,
      recAmnt1: recAmnt1.toString(),
      recToken1: addr.spartav2,
      rec1: member,
    }
  }
  if (txnType === 'fsClaim') {
    let log = txn.logs[txn.logs.length - 1]
    log = decodeEventLog({ abi: abiArray.erc20, ...log }).args
    // FallenSpartans.SpartanClaimed (spartanAddress, amount)
    const recAmnt1 = log.amount
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: recAmnt1.toString(),
      sendToken1: addr.spartav2,
      send1: 'FallenSpartans',
      recAmnt1: recAmnt1.toString(),
      recToken1: addr.spartav2,
      rec1: member,
    }
  }
  // SYNTH.TXN TYPES
  if (txnType === 'synthDeposit') {
    let log = txn.logs[txn.logs.length - 1]
    log = decodeEventLog({ abi: abiArray.synthVault, ...log }).args
    // SynthVault.MemberDeposits (synth, member, newDeposit)
    const recAmnt1 = log.newDeposit
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: recAmnt1.toString(),
      sendToken1: log.synth,
      send1: member,
      recAmnt1: recAmnt1.toString(),
      recToken1: log.synth,
      rec1: 'SynthVault',
    }
  }
  if (txnType === 'synthHarvest') {
    const masterAbi = mergeAbis([
      abiArray.erc20,
      abiArray.synthVault,
      abiArray.pool,
      abiArray.sparta,
    ])
    const logs = []
    for (let i = 0; i < txn.logs.length; i++) {
      logs.push(decodeEventLog({ abi: masterAbi, ...txn.logs[i] }))
    }
    // SynthVault.MemberHarvests (synth, member, amount)
    const harvLogs = logs.filter((x) => x.name === 'MemberHarvests')
    let recAmnt1 = BN(0)
    for (let i = 0; i < harvLogs.length; i++) {
      const harvest = harvLogs[i].args.amount.toString()
      recAmnt1 = recAmnt1.plus(harvest)
    }
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: recAmnt1.toString(),
      sendToken1: addr.spartav2,
      send1: 'Reserve',
      recAmnt1: recAmnt1.toString(),
      recToken1: addr.spartav2,
      rec1: 'Harvest',
    }
  }
  if (txnType === 'synthWithdraw') {
    let log = txn.logs[txn.logs.length - 1]
    log = decodeEventLog({ abi: abiArray.synthVault, ...log }).args
    // SynthVault.MemberWithdraws (synth, member, amount)
    const recAmnt1 = log.amount
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendAmnt1: recAmnt1.toString(),
      sendToken1: log.synth,
      send1: 'SynthVault',
      recAmnt1: recAmnt1.toString(),
      recToken1: log.synth,
      rec1: member,
    }
  }
  if (txnType === 'createSynth') {
    let log = txn.logs[txn.logs.length - 1]
    log = decodeEventLog({ abi: abiArray.synthFactory, ...log }).args
    // SynthFactory.CreateSynth (token, pool, synth)
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      send1: member,
      rec1: log.synth,
    }
  }
  // WEB3.TXN TYPES
  if (txnType === 'approval') {
    let log1 = txn.logs[0] // Token.Approval event
    const recToken1 = log1.address // Approved tokenAddr
    log1 = decodeEventLog({ abi: abiArray.erc20, ...log1 }).args
    return {
      txnHash: txn.transactionHash,
      txnIndex: txn.transactionIndex,
      txnType,
      txnTypeIcon: txnType,
      sendToken1: recToken1,
      send1: log1.owner,
      recToken1,
      rec1: log1.spender,
    }
  }
  return false // Only txns that have parse-logic will make it to the array
}

/** Parse raw txn before localStorage */
export const parseTxn = async (txn, txnType, rpcUrls) => {
  const { chainId } = txn // get chainId from the raw txn data
  let _txn = await getWalletProvider(null, rpcUrls).waitForTransaction(
    txn.hash,
    1,
  ) // wait for the txn object
  // console.log(_txn)
  _txn = parseTxnLogs(_txn, txnType)
  _txn.chainId = chainId // add the chainId into the txn object
  return _txn
}

/** Add txn to history array in localStorage */
export const addTxn = async (walletAddr, newTxn) => {
  let txnArray = tryParse(window.localStorage.getItem('txnArray'))
  if (!txnArray) {
    txnArray = []
    txnArray.push({ wallet: walletAddr, txns: [] })
  }
  let index = txnArray.findIndex((txn) => txn.wallet === walletAddr)
  if (index === -1) {
    txnArray.push({ wallet: walletAddr, txns: [] })
    index = txnArray.findIndex((txn) => txn.wallet === walletAddr)
  }
  txnArray[index].txns.unshift(newTxn)
  window.localStorage.setItem('txnArray', JSON.stringify(txnArray))
}

/** Clear current wallet/chain txn history array in localStorage */
export const clearTxns = async (walletAddr) => {
  let txnArray = tryParse(window.localStorage.getItem('txnArray'))
  if (!txnArray) {
    txnArray = []
    txnArray.push({ wallet: walletAddr, txns: [] })
  } else {
    let index = txnArray.findIndex((txn) => txn.wallet === walletAddr)
    if (index === -1) {
      txnArray.push({ wallet: walletAddr, txns: [] })
      index = txnArray.findIndex((txn) => txn.wallet === walletAddr)
    }
    let filtered = txnArray[index].txns
    if (filtered?.length > 0) {
      filtered = filtered.filter((txn) => txn.chainId !== getChainId())
      txnArray[index].txns = filtered
    }
  }
  window.localStorage.setItem('txnArray', JSON.stringify(txnArray))
}
