import HomePage from "../pages/HomePage/homePage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import BoardComponent from "../pages/BoardPage/board";
import taskPage from "../pages/TaskPage/taskPage";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: ProjectPage },
  { path: "board", component: BoardComponent },
  { path: "task", component: taskPage },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
