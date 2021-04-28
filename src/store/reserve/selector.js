import { useSelector } from 'react-redux'

export const useReserve = () => useSelector((state) => state.reserve)
