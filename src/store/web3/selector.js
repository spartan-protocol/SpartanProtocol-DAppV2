import { useSelector } from 'react-redux'

export const useNetwork = () => useSelector((state) => state.web3.network)
export const useWeb3 = () => useSelector((state) => state.web3)
