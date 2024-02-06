import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

import Input from "@/shared/components/input";

import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
import UploadFileIcon from "@/assets/icons/upload-file.svg?react";
import LikeIcon from "@/assets/icons/like.svg?react";
import Smile from "@/assets/icons/smile.svg?react";
import { useTranslation } from "react-i18next";
import { createMessage } from "@/stores/message/action";
import { User } from "@/shared/models/User";
import { upload } from "@/stores/common/actions";
import { TYPE_MESSAGE } from "@/shared/enums";

const previewConfig = {
  showPreview: false,
};

const TypeMessage = () => {
  const [valueInput, setValueInput] = useState('');
  const [isOpenModalIcon, setIsOpenModalIcon] = useState<boolean>(false);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<any>();
  const valueInputRef = useRef<string>('');

  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = (message?: string, type = TYPE_MESSAGE.TEXT) => {
    const body = {
      conversationId: id,
      sender: user.id,
      content: message || valueInput,
      type,
    };
    dispatch(createMessage(body, () => {
      setValueInput('');
      setIsOpenModalIcon(false);
      valueInputRef.current = '';
    }, () => {}));
  };

  const handleChangeFile = (e: any, type: TYPE_MESSAGE) => {
    const file = e.target.files[0];

    let formData = new FormData()
    formData.append("image", file);

    dispatch(upload(formData, (res: { url: string}) => {
      handleSendMessage(res.url, type);
    }, () => {
    }));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-6 px-4 py-2 border-b border-gray2">
        <div className="cursor-pointer">
          <label htmlFor='input-image' className="cursor-pointer">
            <UploadImageIcon />
          </label>
          <input className='hidden' id='input-image' type='file' accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleChangeFile(e, TYPE_MESSAGE.IMAGE)}></input>
        </div>
        <UploadFileIcon />
      </div>
      <div className="flex items-center space-x-4 px-4">
        <Input ref={inputRef} className="p-4 pl-0" placeholder={t('type_message')} value={valueInput} onChange={handleChange} onKeyPress={handleKeyPress} />
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
        <div className="cursor-pointer" onClick={() => handleSendMessage('👍')}>
          <LikeIcon />
        </div>
      </div>
    </div>
  );
};

export default TypeMessage;
