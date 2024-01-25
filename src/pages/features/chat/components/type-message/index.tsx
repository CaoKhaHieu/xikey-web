import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';

import Input from "@/shared/components/input";

import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
import UploadFileIcon from "@/assets/icons/upload-file.svg?react";
import LikeIcon from "@/assets/icons/like.svg?react";
import Smile from "@/assets/icons/smile.svg?react";
import { useTranslation } from "react-i18next";

const previewConfig = {
  showPreview: false,
};

const TypeMessage = () => {
  const [isOpenModalIcon, setIsOpenModalIcon] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<any>();
  const valueInputRef = useRef<string>('');

  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      const targetElement = e?.target;
      if (!emojiRef.current?.contains(targetElement)) {
        toggleOpenModalIcon(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleOpenModalIcon = (value: boolean) => {
    setIsOpenModalIcon(value);
  };
  
  const onEmojiClick = (emojiObject: any) => {
    const value = `${valueInputRef.current}${emojiObject.emoji}`;
    setValueInput(value);
    valueInputRef.current = value;

    inputRef.current?.focus();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueInput(value);
    valueInputRef.current = value;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-6 px-4 py-2 border-b border-gray2">
        <UploadImageIcon />
        <UploadFileIcon />
      </div>
      <div className="flex items-center space-x-4 px-4">
        <Input ref={inputRef} className="p-4 pl-0" placeholder={t('type_message')} value={valueInput} onChange={handleChange} />
        <div className="flex items-center relative">
          <button onClick={() => toggleOpenModalIcon(!isOpenModalIcon)}>
            <Smile />
          </button>
          {
            isOpenModalIcon &&
            <div className='absolute bottom-12 right-0 z-10' ref={emojiRef}>
              <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled previewConfig={previewConfig} height={350} />
            </div>
          }
        </div>
        <LikeIcon />
      </div>
    </div>
  );
};

export default TypeMessage;
