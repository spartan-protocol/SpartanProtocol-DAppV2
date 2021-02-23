import axios from 'axios'

const net = process.env.REACT_APP_NET

// GET BSCSCAN URL BY WALLET ADDRESS
export const getExplorerWallet = (wallet) => {
    let link = 'https://bscscan.com/address/' + wallet
    if (net === 'testnet') {link = 'https://' + net + '.bscscan.com/address/' + wallet}
    return link
}

// GET BSCSCAN URL BY TXN HASH
export const getExplorerTxn = (txnHash) => {
    let link = 'https://bscscan.com/tx/' + txnHash
    if (net === 'testnet') {link = 'https://' + net + '.bscscan.com/tx/' + txnHash}
    return link
}

// GET CURRENT USD PRICE OF SPARTA TOKEN
export const getPriceSparta = async () => {
    console.log('start get sparta price')
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd')
    //console.log(resp)
    return resp.data["spartan-protocol-token"].usd
}

// GET CURRENT USD PRICE OF A TOKEN (BY COINGECKO ID)
export const getPriceByID = async (ID) => {
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + ID + '&vs_currencies=usd')
    //console.log(resp)
    return resp.data[ID].usd
}

// GET HISTORICAL USD PRICE OF A TOKEN (BY COINGECKO ID)
export const getPastPriceByID = async (ID, date) => {
    // date in this format DD-MM-YYYY
    let resp = await axios.get('https://api.coingecko.com/api/v3/coins/' + ID + '/history?date=' + date)
    //console.log(resp)
    let data = ''
    //console.log(ID, date, resp.data)
    if (!resp.data['market_data']) {
        date = new Date(date)
        date.setDate(date.getDate() + 1)
        let [month, day, year] = new Date(date).toLocaleDateString("en-US").split("/")
        date = day + '-' + month + '-' + year
        data = await getPastPriceByID(ID, date)
    }
    else {data = resp.data['market_data'].current_price.usd}
    return data
}