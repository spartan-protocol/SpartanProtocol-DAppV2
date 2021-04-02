import { useSelector } from 'react-redux'

export const useSynth = () => useSelector((state) => state.synth)
