import React from "react";
import classNames from "classnames";

import "./style.module.scss";

interface ButtonOptions {
  variant?: "contained" | "text" | "outline";
}

type InputProps = React.HTMLProps<HTMLButtonElement> & ButtonOptions;

const Button = (props: InputProps) => {
  const { className, variant, ...otherProps } = props;

  return (
    <>
      <button className={classNames("button", className, variant)} {...otherProps as any}>
        {props.children}
      </button>
    </>
  );
};

export default Button;
