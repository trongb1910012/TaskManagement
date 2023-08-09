import Header from "../components/Header/header";
import Sidebar from "../components/Sidebar/sidebar";

function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "70px" }}>{children}</main>
      </div>
    </>
  );
}

export default DefaultLayout;
