import React from "react";
import classNames from "classnames";

interface IAvatar {
  className: string;
  url: string;
}

const Avatar = (props: IAvatar) => {
  const { className, url } = props;
  return (
    <div
      className={classNames(
        "w-12 h-12 rounded-full border border-white overflow-hidden",
        className
      )}
    >
      <img src={url} />
    </div>
  );
};

export default Avatar;
