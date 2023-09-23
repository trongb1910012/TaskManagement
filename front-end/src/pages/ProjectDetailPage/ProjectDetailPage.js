import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DetailProjectPage.module.scss";
import { useParams } from "react-router-dom";
import DetailTable from "./DetailTable";
const cx = classNames.bind(styles);
const DetailProjectPage = () => {
  const { id } = useParams();
  const [chiTietKeHoach, setChiTietKeHoach] = useState({
    id,
  });

  useEffect(() => {
    setChiTietKeHoach({
      id,
    });
  }, [id]);
  return (
    <div className={cx("wrapper")}>
      Project Detail:{chiTietKeHoach.id}
      <DetailTable id={chiTietKeHoach.id}></DetailTable>
    </div>
  );
};

export default DetailProjectPage;
