import { useSelector } from 'react-redux'

export const useRouter = () => useSelector((state) => state.router)
