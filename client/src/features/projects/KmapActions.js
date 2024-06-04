import React, { useState } from "react";

import Button from "./Button";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

const KmapActions = ({ handlers }) => {
  const [addToggle, setAddToggle] = useState(false);

  const addToggler = (
    <Button
      content={faAdd}
      className={
        addToggle ? "btn-icon actions__btn--toggled" : "btn-icon actions__btn"
      }
      onClick={() => setAddToggle(!addToggle)}
    />
  );

  return (
    <div className="actions bottom-left">
      {/* <Button content={faMinus} className="btn-icon actions__btn" /> */}

      {addToggle ? (
        <div className="actions__row">
          {addToggler}
          <div className="actions__select">
            <Button
              content="Node"
              className="btn-text actions__select__item"
              onClick={() => {
                setAddToggle(false);
                // handlers.placeNode.setState(true);
                handlers.switchControlMode("node", "create", null);
              }}
            />
            <Button
              content="Link"
              className="btn-text actions__select__item"
              onClick={() => {
                setAddToggle(false);

                handlers.switchControlMode("link", "create", null);
                // handlers.clickedNode.setState(null);
                // handlers.placeLink.setState(true);
              }}
            />
          </div>
        </div>
      ) : (
        addToggler
      )}
    </div>
  );
};

export default KmapActions;
