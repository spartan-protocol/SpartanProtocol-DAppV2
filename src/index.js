import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.css'
import './assets/styles/global.scss'

// import '@fontsource/saira/100.css'
// import '@fontsource/saira/200.css'
import '@fontsource/saira/300.css' // We use this (as fw-light class)
import '@fontsource/saira/400.css' // We use this
import '@fontsource/saira/500.css' // We use this
// import '@fontsource/saira/600.css'
import '@fontsource/saira/700.css' // We use this (as 'bolder')
// import '@fontsource/saira/800.css'
// import '@fontsource/saira/900.css'

import '@fontsource/blinker/400.css'

import Providers from './Providers'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
