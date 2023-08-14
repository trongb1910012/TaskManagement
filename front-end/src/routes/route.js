import HomePage from "../pages/HomePage/homePage";
import TableComponent from "../pages/ProjectPage/project";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: TableComponent },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
