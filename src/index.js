import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import AuthLayout from "./components/layout/Auth/Auth.js";
import AdminLayout from "./components/layout/Admin/Admin.js";
import "./assets/css/bd-icons.css";
import "./assets/css/spartan-icons.css";

//import Contexts from './Contexts'
import {UseWalletProvider} from '@binance-chain/bsc-use-wallet'
import "./assets/scss/spartan.scss";


const rpcUrl = process.env.REACT_APP_RPC

ReactDOM.render(
    <React.StrictMode>
        <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
                walletconnect: {rpcUrl},
                bsc: {},
            }}
        >
        </UseWalletProvider>
        <BrowserRouter>
            <Switch>
                <Route path="/auth" render={(props) => <AuthLayout {...props} />}/>
                <Route path="/admin" render={(props) => <AdminLayout {...props} />}/>
                <Redirect from="/" to="/admin/pools/"/>
            </Switch>
        </BrowserRouter>,
    </React.StrictMode>,

    document.getElementById("root")
);
