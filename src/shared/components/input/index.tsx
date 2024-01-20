import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import './style.module.scss';

interface InputOptions {
  variant?: 'search' | 'auth';
  label?: string;
  error?: string;
}

type InputProps = React.HTMLProps<HTMLInputElement> & InputOptions;

const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, variant, label, error, ...rest } = props;
  const { t } = useTranslation();

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
      {
        error &&
        <span className="mt-2 text-xs text-red">{t(error)}</span>
      }
    </div>
  );
});

export default Input;
