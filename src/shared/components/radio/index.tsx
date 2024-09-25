import { useEffect, useState, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import styles from './style.module.scss';
import { RadioOptions } from '@/shared/models/Radio';

interface IRadio {
  options?: any;
  value?: any,
  defaultValue?: any
  onChange?: (val: any) => void,
  onBlur?: (val: any) => void,
  name?: string
  className?: string;
}

const randomName = (Math.random() + 1).toString(36).substring(7);

const Radio: FunctionComponent<IRadio> = (props: IRadio) => {
  const {
    options,
    value,
    defaultValue,
    onChange,
    onBlur,
    className,
    name = randomName,
    ...rest
  } = props;
  const [currentValue, setCurrentValue] = useState<any>(defaultValue);
  const [optionsData, setOptionsData] = useState<RadioOptions[]>();

  const { t } = useTranslation();

  const onChangeRadio = (val: any) => {
    return () => {
      setCurrentValue(val);
      onChange && onChange(val);
      onBlur && onBlur(val);
    };
  };

  useEffect(() => {
    if (options) {
      const mappingOptions = options.map((option: any) => new RadioOptions(option));
      setOptionsData(mappingOptions);
    }
  }, []);

  return (
    <div className={classNames(styles.inputRadio, 'input-radio', className)}>
      {
        optionsData && optionsData.map(option => (
          <label
            className={styles.inputRadioLabel}
            htmlFor={`radio-custom-${option.value}`}
            key={option.value}
          >
            <input
              checked={currentValue === option.value}
              hidden
              type='radio'
              name={name}
              id={`radio-custom-${option.value}`}
              {...rest}
              value={option.value}
              onChange={onChangeRadio(option.value)}
            />
            <div className={styles.inputRadioCheckBox} />
            {option?.text && <span>{t(option.text)}</span>}
          </label>
        ))
      }
    </div>
  );
};

export default Radio;
