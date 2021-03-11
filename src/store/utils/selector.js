import { useSelector } from 'react-redux'

export const useUtils = () => useSelector((state) => state.utils)
