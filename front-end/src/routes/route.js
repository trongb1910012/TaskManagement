import HomePage from "../pages/HomePage/homePage";
import ProjectPage from "../pages/ProjectPage/projectpage";
import BoardComponent from "../pages/BoardPage/board";
import taskPage from "../pages/TaskPage/taskPage";
import Profile from "../pages/ProfilePage/ProfilePage";
import DetailProjectPage from "../pages/ProjectDetailPage/ProjectDetailPage";
import UserListPage from "../pages/UserListPage/UserListPage";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: ProjectPage },
  { path: "project/:id", component: DetailProjectPage },
  { path: "board", component: BoardComponent },
  { path: "task", component: taskPage },
  { path: "profile", component: Profile },
];
const privateRoutes = [{ path: "users", component: UserListPage }];
export { publicRoutes, privateRoutes };
