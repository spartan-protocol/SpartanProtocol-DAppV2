import { useSelector } from 'react-redux'

export const useBond = () => useSelector((state) => state.bond)
