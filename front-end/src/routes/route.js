import HomePage from "../pages/HomePage/homePage";
import ProjectPage from "../pages/ProjectPage/projectpage";
import BoardComponent from "../pages/BoardPage/board";
import taskPage from "../pages/TaskPage/taskPage";
import Profile from "../pages/ProfilePage/ProfilePage";
import DetailProjectPage from "../pages/ProjectDetailPage/ProjectDetailPage";
import UserListPage from "../pages/UserListPage/UserListPage";
import { ReportsList } from "../pages/ReportPage/ReportList";
import { ReportDetail } from "../pages/ReportPage/ReportDetail";
import { ExtendRequestList } from "../pages/Extend/ExntendRequetList";
const publicRoutes = [
  { path: "home", component: HomePage },
  { path: "project", component: ProjectPage },
  { path: "project/:id", component: DetailProjectPage },
  { path: "board", component: BoardComponent },
  { path: "task", component: taskPage },
  { path: "profile", component: Profile },
  { path: "report/:id", component: ReportsList },
  { path: "extend/:id", component: ExtendRequestList },
  { path: "report/detail/:reportId", component: ReportDetail },
];
const privateRoutes = [{ path: "users", component: UserListPage }];
export { publicRoutes, privateRoutes };
