import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <IconButton onClick={goBack} variant="outlined">
        <FontAwesomeIcon icon={faAngleLeft} />
      </IconButton>
    </>
  );
};

export default BackButton;
