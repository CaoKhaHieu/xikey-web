import React from "react";
import classNames from "classnames";

import './style.module.scss';

interface InputOptions {
  variant?: 'search' | 'auth';
  label?: string;
}

type InputProps = React.HTMLProps<HTMLInputElement> & InputOptions;

const Input = (props: InputProps) => {
  const { className, variant, label, ...rest } = props;
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        className={classNames(
          "input",
          className,
          variant
        )}
        {...rest}
      ></input>
    </div>
  );
};

export default Input;
