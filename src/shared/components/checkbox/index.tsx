import { useState, FunctionComponent, ReactElement, useEffect } from 'react';
import classNames from 'classnames';
import style from './style.module.scss';

interface ICheckBox {
  readOnly?: boolean;
  name?: string;
  onChange?: (val: any) => void;
  className?: string;
  isChecked?: boolean;
  render?: () => ReactElement;
}

const randomName = (Math.random() + 1).toString(36).substring(7);

const Checkbox: FunctionComponent<ICheckBox> = ({
  readOnly,
  onChange,
  name = randomName,
  className,
  isChecked,
  render,
  ...rest
}) => {
  const [val, setVal] = useState<boolean>(!!isChecked);

  useEffect(() => {
    if (isChecked) {
      onChange && onChange(isChecked);
    }
  }, [isChecked]);

  const toggleCheck = () => {
    if (!readOnly) {
      setVal(pre => {
        if (onChange) {
          onChange(!pre);
        }
        return !pre;
      });
    }
  };

  return (
    <div className={classNames(className)}>
      <label
        className={classNames(style.inputCheckboxLabel, {
          [style.readOnly]: readOnly,
        })}
        htmlFor={name}
      >
        <input
          checked={val}
          hidden
          type={'checkbox'}
          name={name}
          id={name}
          onChange={toggleCheck}
          {...rest}
        />
        <div className={style.inputCheckbox} />
        {
          render && render()
        }
      </label>
    </div>
  );
};

export default Checkbox;
