import React from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const KmapSave = ({ handlers }) => {
  const saveBtn = (
    <Button
      content={faCloudArrowUp}
      className="btn-icon save bottom-right"
      onClick={() => {
        alert("saving");
        handlers.syncNeeded.setState(false);
      }}
    />
  );

  return <>{handlers.syncNeeded.state ? saveBtn : null}</>;
};

export default KmapSave;
