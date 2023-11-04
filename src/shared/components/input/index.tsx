import React from "react";
import classNames from "classnames";

type InputProps = React.HTMLProps<HTMLInputElement>;

const Input = (props: InputProps) => {
  const { className, ...rest } = props;
  return (
    <>
      <input
        className={classNames(
          "border-none outline-none w-full py-1.5 px-3 text-black flex",
          className
        )}
        {...rest}
      ></input>
    </>
  );
};

export default Input;
