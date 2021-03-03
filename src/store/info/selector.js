import {
    useSelector
} from 'react-redux';

export const useInfo = () => useSelector(state => state.info);