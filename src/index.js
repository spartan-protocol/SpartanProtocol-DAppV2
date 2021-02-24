import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import AdminLayout from "./components/layout/Common.js";
import "./assets/css/bd-icons.css";
import "./assets/css/spartan-icons.css";

//import Contexts from './Contexts'
import {UseWalletProvider} from '@binance-chain/bsc-use-wallet'
import "./assets/scss/spartan.scss";

import { createStore, applyMiddleware } from "redux";
import { web3Reducer } from "./utils/web3Store/reducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

const store = createStore(web3Reducer, applyMiddleware(thunk));


const rpcUrl = process.env.REACT_APP_RPC

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <UseWalletProvider
                chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
                connectors={{
                    walletconnect: {rpcUrl},
                    bsc: {},
                }}
            >
                <BrowserRouter>
                    <Switch>
                        <Route path="/" render={(props) => <AdminLayout {...props} />}/>
                        <Redirect from="/" to="/dapp/buttons/"/>
                    </Switch>
                </BrowserRouter>,
            </UseWalletProvider>
        </React.StrictMode>,
    </Provider>,

    document.getElementById("root")
);
