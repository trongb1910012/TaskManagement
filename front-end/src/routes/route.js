import HomePage from "../pages/HomePage/homePage";
import TableComponent from "../pages/ProjectPage/project";
import BoardComponent from "../pages/BoardPage/board";
import taskPage from "../pages/TaskPage/taskPage";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: TableComponent },
  { path: "board", component: BoardComponent },
  { path: "task", component: taskPage },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
