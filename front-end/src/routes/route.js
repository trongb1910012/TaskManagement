import HomePage from "../pages/HomePage/homePage";
import TableComponent from "../pages/ProjectPage/project";
import BoardComponent from "../pages/BoardPage/board";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: TableComponent },
  { path: "binhluan", component: BoardComponent },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
