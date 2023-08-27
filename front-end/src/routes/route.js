import HomePage from "../pages/HomePage/homePage";
import TableComponent from "../pages/ProjectPage/project";
import Grid from "../pages/ProjectPage/projectpage";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: TableComponent },
  { path: "binhluan", component: Grid },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
