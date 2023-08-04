import Header from "../components/Header/header";
import Sidebar from "../components/Sidebar/sidebar";

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <Sidebar />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
