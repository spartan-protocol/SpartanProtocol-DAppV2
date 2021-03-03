import Dashboard from "./components/Dashbaord/Dashboard";
import PoolsTable from "./views/pages/PoolsTable.js";
import Positions from "./views/pages/Positions.js";
import Icons from "./views/pages/Samples/Icons";
import Notifications from "./views/pages/Samples/Notifications";
import Buttons from "./views/pages/Samples/Buttons";
import Alerts from "./views/pages/Samples/Alerts";
import Typography from "./views/pages/Samples/Typography";
import Grid from "./views/pages/Samples/Grid";
import ReactTables from "./views/pages/Samples/ReactTables";
import Forms from "./views/pages/Samples/Forms";
import ExtendedForms from "./views/pages/Samples/ExtendedForms";
import Panels from "./views/pages/Samples/Panels";
import Tiles from "./views/pages/Samples/Tiles";
import AddLiquidity from "./views/pages/AddLiquidity";

import Tabs from "./views/pages/Samples/Tabs";


const routes = [

    {
        path: "/home",
        name: "Home",
        icon: "icon-medium icon-home icon-dark",
        component: Dashboard,
        layout: "/dapp",
    },

    {
        path: "/join",
        name: "Pools",
        icon: "icon-medium icon-swords icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },

    {
        path: "/join1",
        name: "Dao",
        icon: "icon-medium icon-colosseum icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        path: "/join2",
        name: "Trade",
        icon: "icon-medium icon-sword icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        path: "/join3",
        name: "Vote",
        icon: "icon-medium icon-circle icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        path: "/join4",
        name: "Analysis",
        icon: "icon-medium icon-helmet icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        path: "/join5",
        name: "Documents",
        icon: "icon-medium icon-info icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        path: "/join6",
        name: "Settings",
        icon: "icon-medium icon-gear icon-dark",
        component: AddLiquidity,
        layout: "/dapp",
    },
    {
        collapse: true,
        name: "Components",
        icon: "icon-medium icon-info icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/cards",
                name: "Tiles",
                mini: "CR",
                component: Tiles,
                layout: "/dapp",
            },
            {
                path: "/buttons",
                name: "Buttons",
                mini: "BU",
                component: Buttons,
                layout: "/dapp",
            },
            {
                path: "/notificaions",
                name: "Notificaions",
                mini: "NO",
                component: Notifications,
                layout: "/dapp",
            },
            {
                path: "/panels",
                name: "Panels",
                mini: "PA",
                component: Panels,
                layout: "/dapp",
            },
            {
                path: "/alerts",
                name: "Alerts",
                mini: "AL",
                component: Alerts,
                layout: "/dapp",
            },
            {
                path: "/typography",
                name: "Typography",
                mini: "TY",
                component: Typography,
                layout: "/dapp",
            },
            {
                path: "/tables",
                name: "ReactTables",
                mini: "TB",
                component: ReactTables,
                layout: "/dapp",
            },
            {
                path: "/forms",
                name: "Forms",
                mini: "FO",
                component: Forms,
                layout: "/dapp",
            },
            {
                path: "/input",
                name: "Input",
                mini: "FO",
                component: ExtendedForms,
                layout: "/dapp",
            },
            {
                path: "/grid",
                name: "Grid",
                mini: "GR",
                component: Grid,
                layout: "/dapp",
            },
            {
                path: "/tabs",
                name: "Tabs",
                mini: "TB",
                component: Tabs,
                layout: "/dapp",
            },
            {
                path: "/icons",
                name: "Icons",
                mini: "IC",
                component: Icons,
                layout: "/dapp",
            },
        ],
    }

];

export default routes;
