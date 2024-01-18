import React, { forwardRef } from "react";
import classNames from "classnames";

import './style.module.scss';

interface InputOptions {
  variant?: 'search' | 'auth';
  label?: string;
}

type InputProps = React.HTMLProps<HTMLInputElement> & InputOptions;

const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, variant, label, ...rest } = props;
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        ref={ref}
        className={classNames(
          "input",
          className,
          variant
        )}
        {...rest}
      ></input>
    </div>
  );
});

export default Input;
