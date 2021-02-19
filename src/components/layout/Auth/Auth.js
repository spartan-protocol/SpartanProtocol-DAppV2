
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AuthNavbar from "../../../components/Navbars/AuthNavbar.js";
import Footer from "../../../components/Footer/Footer.js";

import routes from "../../../routes.js";

const Pages = (props) => {
  React.useEffect(() => {
    document.documentElement.classList.remove("nav-open");
  });
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getFullPageName = (routes) => {
    let pageName = getActiveRoute(routes);
    switch (pageName) {
      case "Item1":
        return "#";
      case "Item1":
        return "#";
      case "Item1":
        return "#";
      case "Item1":
        return "#";
      default:
        return "Default Brand Text";
    }
  };
  return (
    <>
      <AuthNavbar brandText={getActiveRoute(routes) + " Page"} />
      <div className="wrapper wrapper-full-page">
        <div className={"full-page " + getFullPageName(routes)}>
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/auth/login" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    </>
  );
};

export default Pages;
