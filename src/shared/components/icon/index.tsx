import { ReactElement, useState } from "react";
import classNames from "classnames";

import "./style.module.scss";

interface IconsOptions {
  icon: ReactElement;
  className?: string;
  onClick?: () => void;
}

const Icon = (props: IconsOptions) => {
  const { icon, className, onClick } = props;
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = () => {
    setToggle(!toggle);
    onClick && onClick();
  };

  return (
    <div
      className={classNames("icon", className, {
        active: toggle,
      })}
      onClick={handleToggle}
    >
      {icon}
    </div>
  );
};

export default Icon;
