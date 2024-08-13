import React, { useEffect, useState } from 'react';

interface TextareaOptions {
  onChange: (val: any) => void;
  onBlur: (val: any) => void;
  value: string;
}

type TextareaProps = React.HTMLProps<HTMLAreaElement> & TextareaOptions;

const Textarea = (props: TextareaProps) => {
  const { value, onChange, onBlur, ...otherProps } = props;
  const [inputValue, setValueInput] = useState<string>(value);

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    onChange(inputValue);
    onBlur(inputValue);
  }, [inputValue]);

  return (
    <textarea
      id="message"
      className="border border-gray2 rounded-lg p-2 w-full outline-none" placeholder="Write your thoughts here..."
      onChange={handleChangeValue}
      {...otherProps as any}
    >
    </textarea>
  );
};

export default Textarea;
