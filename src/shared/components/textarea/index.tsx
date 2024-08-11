import React, { useEffect, useState } from 'react';

interface TextareaProps {
  onChange: (val: any) => void;
  onBlur: (val: any) => void;
  value: string;
}

const Textarea = (props: TextareaProps) => {
  const { value, onChange, onBlur } = props;
  const [inputValue, setValueInput] = useState<string>(value);

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    onChange(inputValue);
    onBlur(inputValue);
  }, [inputValue]);

  return (
    <textarea id="message" className="border border-gray2 rounded-lg p-2 w-full outline-none" placeholder="Write your thoughts here..." onChange={handleChangeValue}></textarea>
  );
};

export default Textarea;
