import React from 'react'
import Lottie from 'react-lottie'
import SpartanSpinner from '../../assets/img/SpartanSpinner.json'

const HelmetLoading = ({ height, width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SpartanSpinner,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return <Lottie options={defaultOptions} height={height} width={width} />
}

export default HelmetLoading
