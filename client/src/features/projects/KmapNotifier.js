import React from "react";

const KmapNotifier = ({ handlers }) => {
  const ESC_node = "Press ESC key unselect node";
  const ESC_link = "Press ESC key unselect link";

  return (
    <>
      {handlers.ctrlMode?.state?.subject === "node" ? (
        <div className="notifier">
          <p className="notifier__msg">{ESC_node}</p>
        </div>
      ) : handlers.ctrlMode?.state?.subject === "link" ? (
        <div className="notifier">
          <p className="notifier__msg">{ESC_link}</p>
        </div>
      ) : null}
    </>
  );
};

export default KmapNotifier;
