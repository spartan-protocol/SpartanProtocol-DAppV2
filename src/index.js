import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import AdminLayout from "./components/layout/Common.js";
import "./assets/css/bd-icons.css";
import "./assets/css/spartan-icons.css";
import "./app.scss";
//import Contexts from './Contexts'
import {UseWalletProvider} from '@binance-chain/bsc-use-wallet'
import "./assets/scss/spartan.scss";

import { createStore, applyMiddleware, combineReducers } from "redux";
import { confirmationReducer } from "./store/confirmation";
import { infoReducer } from './store/info';
import { pricingReducer } from './store/pricing';
import { coreMathReducer } from './store/coreMath';
import { Provider } from "react-redux";
import thunk from "redux-thunk";

const reducers = combineReducers({info: infoReducer, confirmation: confirmationReducer, pricing: pricingReducer, coreMath: coreMathReducer });

const store = createStore(reducers, applyMiddleware(thunk));


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
