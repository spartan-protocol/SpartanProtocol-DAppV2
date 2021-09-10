import axios from 'axios'
import { getNetwork } from './web3'

export const apiUrlBQ = 'https://graphql.bitquery.io'
export const headerBQ = {
  'content-type': 'application/json',
  'X-API-KEY': process.env.REACT_APP_BITQUERY,
}

// GET BSCSCAN URL BY CONTRACT ADDRESS
export const getExplorerContract = (contractAddr) => {
  const { net } = getNetwork()
  let link = `https://bscscan.com/address/${contractAddr}#code`
  if (net === 'testnet') {
    link = `https://${net}.bscscan.com/address/${contractAddr}#code`
  }
  return link
}

// GET BSCSCAN URL BY WALLET ADDRESS
export const getExplorerWallet = (wallet) => {
  const { net } = getNetwork()
  let link = `https://bscscan.com/address/${wallet}`
  if (net === 'testnet') {
    link = `https://${net}.bscscan.com/address/${wallet}`
  }
  return link
}

// GET BSCSCAN URL BY TXN HASH
export const getExplorerTxn = (txnHash) => {
  const { net } = getNetwork()
  let link = `https://bscscan.com/tx/${txnHash}`
  if (net === 'testnet') {
    link = `https://${net}.bscscan.com/tx/${txnHash}`
  }
  return link
}

// GET CURRENT USD PRICE OF SPARTA TOKEN
export const getPriceSparta = async () => {
  const resp = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd',
  )
  return resp.data['spartan-protocol-token'].usd
}

// GET CURRENT USD PRICE OF A TOKEN (BY COINGECKO ID)
export const getPriceByID = async (ID) => {
  const resp = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ID}&vs_currencies=usd`,
  )
  return resp.data[ID].usd
}

// GET HISTORICAL USD PRICE OF A TOKEN (BY COINGECKO ID)
export const getPastPriceByID = async (ID, date) => {
  // date in this format DD-MM-YYYY
  const resp = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${ID}/history?date=${date}`,
  )
  let data = ''
  if (!resp.data.market_data) {
    let theDate = new Date(date)
    theDate.setDate(theDate.getDate() + 1)
    const [month, day, year] = new Date(theDate)
      .toLocaleDateString('en-US')
      .split('/')
    theDate = `${day}-${month}-${year}`
    theDate = await getPastPriceByID(ID, theDate)
  } else {
    data = resp.data.market_data.current_price.usd
  }
  return data
}
