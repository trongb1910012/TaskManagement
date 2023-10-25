import { useState } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboard,
  faHouse,
  faList,
  faPowerOff,
  faTh,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

const SidebarLink = ({ to, name, icon, isOpen }) => {
  const isActive = useMatch(to);

  return (
    <NavLink to={to} className={cx("link", { active: isActive })}>
      <div className={cx("icon")}>{icon}</div>
      <div
        className={cx("link_text")}
        style={{ display: isOpen ? "block" : "none" }}
      >
        {name}
      </div>
    </NavLink>
  );
};
const menuConfig = {
  admin: [
    {
      path: "/tasking/home",
      name: "Home",
      icon: <FontAwesomeIcon icon={faHouse} />,
    },
    {
      path: "/tasking/admin/users",
      name: "Employee",
      icon: <FontAwesomeIcon icon={faUserGroup} />,
    },
    {
      path: "/tasking",
      name: "Log Out",
      icon: <FontAwesomeIcon icon={faPowerOff} />,
    },
  ],

  "project manager": [
    {
      path: "/tasking/home",
      name: "Home",
      icon: <FontAwesomeIcon icon={faHouse} />,
    },
    {
      path: "/tasking/project",
      name: "Project",
      icon: <FontAwesomeIcon icon={faClipboard} />,
    },
    {
      path: "/tasking/board",
      name: "Board",
      icon: <FontAwesomeIcon icon={faTh} />,
    },
    {
      path: "/tasking",
      name: "Log Out",
      icon: <FontAwesomeIcon icon={faPowerOff} />,
    },
  ],

  "board manager": [
    {
      path: "/tasking/home",
      name: "Home",
      icon: <FontAwesomeIcon icon={faHouse} />,
    },
    {
      path: "/tasking/board",
      name: "Board",
      icon: <FontAwesomeIcon icon={faTh} />,
    },
    {
      path: "/tasking/task",
      name: "Task",
      icon: <FontAwesomeIcon icon={faList} />,
    },

    {
      path: "/tasking",
      name: "Log Out",
      icon: <FontAwesomeIcon icon={faPowerOff} />,
    },
  ],

  user: [
    {
      path: "/tasking/home",
      name: "Home",
      icon: <FontAwesomeIcon icon={faHouse} />,
    },

    {
      path: "/tasking/task",
      name: "Task",
      icon: <FontAwesomeIcon icon={faList} />,
    },

    {
      path: "/tasking",
      name: "Log Out",
      icon: <FontAwesomeIcon icon={faPowerOff} />,
    },
  ],
};
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const role = localStorage.getItem("role");
  const toggle = () => setIsOpen(!isOpen);

  // Khởi tạo biến menu
  let menuItem;

  // Xử lý để lấy ra menu phù hợp với từng role
  if (menuConfig[role]) {
    menuItem = menuConfig[role];
  } else {
    menuItem = [];
  }

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx("container")}
        style={{ width: isOpen ? "250px" : "70px" }}
      >
        <div className={cx("top_section")}>
          <div
            className={cx("bars")}
            style={{ marginLeft: isOpen ? "0px" : "0px" }}
          >
            <FontAwesomeIcon icon={faBars} onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <SidebarLink
            key={index}
            to={item.path}
            name={item.name}
            icon={item.icon}
            isOpen={isOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
