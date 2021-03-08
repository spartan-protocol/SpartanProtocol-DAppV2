import {
    useSelector
} from 'react-redux';

export const useSparta = () => useSelector(state => state.sparta);