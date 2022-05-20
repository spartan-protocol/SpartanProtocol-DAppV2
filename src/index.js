import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.css'
import './assets/styles/global.scss'

import '@fontsource/saira/100.css' //
import '@fontsource/saira/200.css' //
import '@fontsource/saira/300.css'
import '@fontsource/saira/400.css'
import '@fontsource/saira/500.css'
import '@fontsource/saira/600.css' //
import '@fontsource/saira/700.css' //
import '@fontsource/saira/800.css'
import '@fontsource/saira/900.css'

import Providers from './Providers'

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Providers />
  </StrictMode>
);