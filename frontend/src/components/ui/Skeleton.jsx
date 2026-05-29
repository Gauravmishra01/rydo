import React from "react";
import PropTypes from "prop-types";

const Skeleton = ({
  height = "1rem",
  width = "100%",
  style,
  rounded = "16px",
}) => {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: rounded, ...style }}
      aria-hidden="true"
    />
  );
};

Skeleton.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.object,
  rounded: PropTypes.string,
};
export default Skeleton;
