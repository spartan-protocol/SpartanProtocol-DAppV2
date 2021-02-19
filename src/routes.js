import Dashboard from "./components/Dashbaord/Dashboard";
import PoolsTable from "./views/pages/Pools/PoolsTable.js";
import Positions from "./views/pages/Pools/Positions/Positions.js";
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


const routes = [
    {
        path: "/",
        name: "Home",
        icon: "icon-small icon-home icon-light",
        component: Dashboard,
        layout: "/admin",
    },
    {
        collapse: true,
        name: "Pools",
        icon: "icon-medium icon-pools icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/pools",
                name: "Item1",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }, {
                path: "/positions",
                name: "Item2",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }
        ],
    },
    {
        collapse: true,
        name: "DAO",
        icon: "icon-medium icon-users icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/dao1",
                name: "Item1",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }, {
                path: "/dao2",
                name: "Item2",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }
        ],
    },
    {
        collapse: true,
        name: "Trade",
        icon: "icon-medium icon-swap icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/trade1",
                name: "Item1",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }, {
                path: "/trade2",
                name: "Item2",
                mini: "IT",
                component: Positions,
                layout: "/admin",
            }
        ],
    },
    {
        collapse: true,
        name: "Vote",
        icon: "icon-medium icon-down icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/vote1",
                name: "Item1",
                mini: "IT",
                component: PoolsTable,
                layout: "/admin",
            }, {
                path: "/vote2",
                name: "Item2",
                mini: "IT",
                component: PoolsTable,
                layout: "/admin",
            }
        ],
    },
    {
        collapse: true,
        name: "Analysis",
        icon: "icon-medium icon-analysis icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/analysis1",
                name: "Item1",
                mini: "IT",
                component: PoolsTable,
                layout: "/admin",
            }, {
                path: "/analysis2",
                name: "Item2",
                mini: "IT",
                component: PoolsTable,
                layout: "/admin",
            }
        ],
    },
    {
        collapse: true,
        name: "Components",
        icon: "icon-medium icon-info icon-dark",
        state: "pagesCollapse",
        views: [
            {
                path: "/buttons",
                name: "Buttons",
                mini: "BU",
                component: Buttons,
                layout: "/admin",
            }, {
                path: "/notificaions",
                name: "Notificaions",
                mini: "NO",
                component: Notifications,
                layout: "/admin",
            },
            {
                path: "/panels",
                name: "Panels",
                mini: "PA",
                component: Panels,
                layout: "/admin",
            },
            {
                path: "/alerts",
                name: "Alerts",
                mini: "AL",
                component: Alerts,
                layout: "/admin",
            },
            {
                path: "/typography",
                name: "Typography",
                mini: "TY",
                component: Typography,
                layout: "/admin",
            },
            {
                path: "/tables",
                name: "ReactTables",
                mini: "TB",
                component: ReactTables,
                layout: "/admin",
            },
            {
                path: "/forms",
                name: "Forms",
                mini: "FO",
                component: Forms,
                layout: "/admin",
            },
            {
                path: "/input",
                name: "Input",
                mini: "FO",
                component: ExtendedForms,
                layout: "/admin",
            },
            {
                path: "/grid",
                name: "Grid",
                mini: "GR",
                component: Grid,
                layout: "/admin",
            },
            {
                path: "/icons",
                name: "Icons",
                mini: "IC",
                component: Icons,
                layout: "/admin",
            },
        ],
    }

];

export default routes;
