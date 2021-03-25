import { useSelector } from 'react-redux'

export const usePoolFactory = () => useSelector((state) => state.poolFactory)
