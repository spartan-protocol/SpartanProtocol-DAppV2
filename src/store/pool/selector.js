import { useSelector } from 'react-redux'

export const usePool = () => useSelector((state) => state.pool)
