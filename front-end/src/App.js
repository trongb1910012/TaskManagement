import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/defaultLayout/DefaultLayout";
import Login from "./pages/Login/login";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={`/tasking/${route.path}`}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          <Route path="/" element={<Navigate to="/tasking" />} />
          <Route path="/tasking" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
