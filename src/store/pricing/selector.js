import { useSelector } from 'react-redux'

export const usePricing = () => useSelector((state) => state.pricing)
