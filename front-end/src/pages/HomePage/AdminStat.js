import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./homepage.module.scss";
import axiosClient from "../../api/api";
const cx = classNames.bind(styles);
export function AdminStat() {
  const [stat, setStat] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/users`);
      setStat(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.info(stat);
  return (
    <div className={cx("stats")}>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>Tasks: </span>
        <span className={cx("count")}>30</span>
      </button>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>In progress: </span>
        <span className={cx("count")}>30</span>
      </button>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>Users: </span>
        <span className={cx("count")}>{stat.userCount}</span>
      </button>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>Project Manager: </span>
        <span className={cx("count")}>{stat.pmCount}</span>
      </button>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>Board Manager: </span>
        <span className={cx("count")}>{stat.bmCount}</span>
      </button>
      <button className={cx("stat")}>
        <span className={cx("stat-label")}>Reports: </span>
        <span className={cx("count")}>30</span>
      </button>
    </div>
  );
}
