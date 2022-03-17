import Login from "./pages/Login/Login";
import Search from "./pages/Search/Search";

interface IRouteSchema {
  url: string;
  Component: React.ReactNode;
  auth: boolean;
}

export const routeList = [
  {
    // name: "",
    url: "/login",
    Component: Login,
    auth: false,
  },
  {
    // name: "",
    url: "/",
    Component: Search,
    auth: true,
  },
  {
    // name: "",
    url: "/annotate",
    Component: Login,
    auth: true,
  },
];
