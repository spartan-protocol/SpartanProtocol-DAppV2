import { useSelector } from 'react-redux'

export const useDao = () => useSelector((state) => state.dao)
