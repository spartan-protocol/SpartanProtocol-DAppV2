import { useSelector } from 'react-redux'

export const useBondVault = () => useSelector((state) => state.bondVault)
