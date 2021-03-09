import { useSelector } from 'react-redux'

export const useConfirmation = () => useSelector((state) => state.confirmation)
