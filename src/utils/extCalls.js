import axios from 'axios'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { getNetwork } from './web3'

export const subgraphAPI =
  'https://api.thegraph.com/subgraphs/name/spartan-protocol/pool-factory'
export const subgraphClient = new ApolloClient({
  uri: subgraphAPI,
  cache: new InMemoryCache(),
})

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

//
export const getSubGraphBlock = async () => {
  const tokensQuery = `
  query {
    _meta{
      block {
        number
      }
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data._meta.block.number)
    if (!result) {
      console.log('no result')
      return false
    }
    const info = await result
    return info
  } catch (err) {
    console.log(err)
    return false
  }
}

//
export const getMemberPositions = async (memberAddr) => {
  const block = await getSubGraphBlock()
  const member = memberAddr.toString().toLowerCase()
  const tokensQuery = `
  query {
    members(where: {id: "${member}"}) {
      id
      fees
      netAddSparta
      netRemSparta
      netHarvestSparta
      netAddUsd
      netRemUsd
      netHarvestUsd
      positions {
        pool {
          id
          symbol
        }
        netAddSparta
        netRemSparta
        netAddToken
        netRemToken
        netAddUsd
        netRemUsd
        netLiqUnits
      }
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data.members[0])
    if (!result) {
      console.log('no result')
      return [false, 0]
    }
    const info = await result
    return [info, block]
  } catch (err) {
    console.log(err)
    return [false, 0]
  }
}

//
export const getMemberSynthPositions = async (memberAddr) => {
  const block = await getSubGraphBlock()
  const member = memberAddr.toString().toLowerCase()
  const tokensQuery = `
  query {
    members(where: {id: "${member}"}) {
      id
      netForgeSparta
      netForgeUsd
      netMeltSparta
      netMeltUsd
      netSynthHarvestSparta
      netSynthHarvestUsd
      synthPositions {
        id
        netForgeSparta
        netForgeUsd
        netMeltSparta
        netMeltUsd
        netSynthHarvestSparta
        netSynthHarvestUsd
      }
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data.members[0])
    if (!result) {
      console.log('no result')
      return [false, 0]
    }
    const info = await result
    return [info, block]
  } catch (err) {
    console.log(err)
    return [false, 0]
  }
}

export const getPoolIncentives = async (listedPools) => {
  const _poolArray = []
  for (let i = 0; i < listedPools.length; i++) {
    _poolArray.push(listedPools[i].address.toString().toLowerCase())
  }
  const count = _poolArray.length * 30 <= 1000 ? _poolArray.length * 30 : 1000
  const tokensQuery = `
  query {
    metricsPoolDays(orderBy: timestamp, orderDirection: desc, first: ${count}, where: {pool_in: [${_poolArray.map(
    (x) => `"${x}"`,
  )}]}) {
      id
      timestamp
      fees30Day
      incentives30Day
      pool {
        id
      }
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data.metricsPoolDays)
    if (!result) {
      console.log('no result')
      return false
    }
    const info = await result
    return info
  } catch (err) {
    console.log(err)
    return false
  }
}

//
export const callGlobalMetrics = async () => {
  const tokensQuery = `
  query {
    metricsGlobalDays(orderBy: id, orderDirection: desc) {
      id
      timestamp
      volSPARTA
      volUSD
      fees
      feesUSD
      txCount
      tvlSPARTA
      tvlUSD
      daoVault30Day
      synthVault30Day
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data.metricsGlobalDays)
    if (!result) {
      console.log('no result')
      return false
    }
    const metrics = await result
    return metrics
  } catch (err) {
    console.log(err)
    return false
  }
}

export const callPoolMetrics = async (poolAddress) => {
  const address = poolAddress.toString().toLowerCase()
  const tokensQuery = `
  query {
    metricsPoolDays(orderBy: timestamp, orderDirection: desc, where: {pool: "${address}"}) {
      id
      timestamp
      pool {
        id
      }
      volSPARTA
      volUSD
      fees
      feesUSD
      fees30Day
      incentives
      incentivesUSD
      incentives30Day
      txCount
      tvlSPARTA
      tvlUSD
      tokenPrice
    }
  }
`
  try {
    const result = await subgraphClient
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => data.data.metricsPoolDays)
    if (!result) {
      console.log('no result')
      return false
    }
    const metrics = await result
    // console.log(metrics)
    return metrics
  } catch (err) {
    console.log(err)
    return false
  }
}
