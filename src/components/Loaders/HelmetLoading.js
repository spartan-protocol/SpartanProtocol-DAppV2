import Lottie from 'lottie-react'
import React from 'react'
import SpartanSpinner from '../../assets/img/SpartanSpinner.json'

const HelmetLoading = (size) => {
  const style = {
    height: size,
  }

  return <Lottie animationData={SpartanSpinner} style={style} />
}

export default HelmetLoading
