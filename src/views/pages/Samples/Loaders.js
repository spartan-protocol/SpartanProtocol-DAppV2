import React from 'react'
import SpartanLoading from '../../../components/Loaders/SpartanLoading'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Loaders = () => (
  <div>
    <div className="spartan-loading">
      <SpartanLoading />
    </div>
    <div className="helm-loading">
      <HelmetLoading />
    </div>
  </div>
)

export default Loaders
