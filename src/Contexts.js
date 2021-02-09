import React from 'react'
import bsc, { UseWalletProvider } from '@binance-chain/bsc-use-wallet'

const Contexts = ({ children }) => {
    const rpcUrl = process.env.REACT_APP_RPC

    return (
        <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
                walletconnect: { rpcUrl },
                bsc,
            }}
        >
        </UseWalletProvider>
    )
}

export default Contexts