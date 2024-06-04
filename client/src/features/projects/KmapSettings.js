import React, { useState } from "react";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";

import Card from "./Card";
import Button from "./Button";
import Slider from "./Slider";

const KmapSettings = ({ handlers }) => {
  const [extended, setExtended] = useState(false);

  const toggleButton = (
    <Button
      content={faGears}
      className={
        extended ? "btn-icon settings__btn--toggled" : "btn-icon settings__btn"
      }
      onClick={() => setExtended(!extended)}
    />
  );

  return (
    <>
      {!extended ? (
        <Card className="card--shadow top-left" bgColor="#D2A8FF">
          {toggleButton}
        </Card>
      ) : (
        <Card className="card settings top-left " bgColor="#10162f">
          {toggleButton}

          <div className="card__content">
            <div className="card__row">
              {/* Toggle button with text to toggle link category display */}
              <Button
                content="Link Category"
                className={
                  handlers.category.state
                    ? "btn-text settings__item-btn--toggled "
                    : "btn-text settings__item-btn"
                }
                onClick={() =>
                  handlers.category.setState(!handlers.category.state)
                }
              />
              <Button
                content="Link Label"
                className={"btn-text settings__item-btn"}
              />
            </div>
            <div className="card__row">
              <Slider
                className="slider settings__item-sld"
                onChange={(e) =>
                  handlers.linkDistance.setState((e.target.value / 100.0) * 400)
                }
              />
              <span className="settings__item-span">
                Distance: {Math.round(handlers.linkDistance.state)}
              </span>
            </div>
            <div className="card__row">
              <span className="settings__item-span">
                Font Size: {handlers.fontSize.state}
              </span>
              <Button
                content={faMagnifyingGlassPlus}
                className="btn-icon settings__item-btn"
                onClick={() => {
                  if (handlers.fontSize.state < 32) {
                    handlers.fontSize.setState(handlers.fontSize.state + 1);
                  }
                }}
              />
              <Button
                content={faMagnifyingGlassMinus}
                className="btn-icon settings__item-btn"
                onClick={() => {
                  if (handlers.fontSize.state > 6) {
                    handlers.fontSize.setState(handlers.fontSize.state - 1);
                  }
                }}
              />
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default KmapSettings;
