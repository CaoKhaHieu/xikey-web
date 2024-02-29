import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

import Input from "@/shared/components/input";
import { User } from "@/shared/models/User";
import { upload } from "@/stores/common/actions";
import { TYPE_MESSAGE } from "@/shared/enums";
import { Message } from "@/shared/models/Message";
import { VALIDATE_LENGTH } from "@/shared/constants";
import { showToast } from "@/shared/utils/utils";
import { clearReplyMessage, createMessage } from "@/stores/message/action";

import LikeIcon from "@/assets/icons/like.svg?react";
import Smile from "@/assets/icons/smile.svg?react";
import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
// import UploadFileIcon from "@/assets/icons/file.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";

interface ImageData {
  urlLocal: string;
  url: string;
  id: number;
}

interface UploadImage {
  [key: number]: ImageData;
}

const previewConfig = {
  showPreview: false,
};

const TypeMessage = () => {
  const [uploadImage, setUploadImage] = useState<UploadImage>({});
  const listImg = Object.values(uploadImage);
  
  const [valueInput, setValueInput] = useState('');
  const [isOpenModalIcon, setIsOpenModalIcon] = useState<boolean>(false);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<any>();
  const valueInputRef = useRef<string>('');
  const countUploadImagesRef = useRef<number>(listImg.length);

  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const replyMessage: Message = messageManagement.reply[id];

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = (event.clipboardData || (event as any).originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          // limit image
          if (countUploadImagesRef.current >= VALIDATE_LENGTH.LIMIT_IMAGES) {
            showToast('limit_image_upload');
            return;
          }

          const file: File = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const src = e.target.result;
            const dataImage: ImageData = {
              url: '',
              urlLocal: src,
              id: file.lastModified
            };
            setUploadImage((prev) => ({
              ...prev,
              [file.lastModified]: dataImage
            }));
          };
          reader.readAsDataURL(file);

          // upload image
          let formData = new FormData()
          formData.append("image", file);
          
          dispatch(upload(formData, (res: { url: string}) => {
            setUploadImage((prev) => ({
              ...prev,
              [file.lastModified]: {
                url: res.url,
                urlLocal: '',
                id: file.lastModified
              }
            }));
          }, () => {
          }));

          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
    countUploadImagesRef.current = listImg.length;
  }, [listImg.length]);

  const handleRemoveImage = (key: number) => {
    const newData: UploadImage = { ...uploadImage };
    delete newData[key];
    setUploadImage(newData);
  };

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

  useEffect(() => {
    inputRef.current?.focus();
  }, [replyMessage]);
  
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
      const isUploadingImage = listImg.length && listImg.find((image: ImageData) => !image.url);
      if (listImg.length > 0 && isUploadingImage) {
        showToast('uploading_image');
        return;
      }

      e.preventDefault();
      handleSendMessage();

      if (listImg.length > 0) {
        const listUrl = listImg.map((item: ImageData) => item.url);
        const contentMessage = listUrl.join(',');
        handleSendMessage(contentMessage, TYPE_MESSAGE.IMAGE_LIST);
        setUploadImage({});
      }
    }
  };

  const handleSendMessage = (message?: string, type = TYPE_MESSAGE.TEXT) => {
    const isImageMessage = type == TYPE_MESSAGE.IMAGE;
    const body = {
      conversationId: id,
      sender: user.id,
      content: message || valueInput,
      type,
      replyMessage: isImageMessage ? undefined : replyMessage?.id,
    };
    if (!body.content) {
      return;
    }
    
    dispatch(createMessage(body, () => {
      setValueInput('');
      setIsOpenModalIcon(false);
      valueInputRef.current = '';

      !isImageMessage && dispatch(clearReplyMessage({ conversationId: id }));
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

  const handleClearReply = () => {
    dispatch(clearReplyMessage({ conversationId: id }));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 px-2 py-1 border-b border-gray2">
        <div className="cursor-pointer duration-300 hover:bg-gray2 p-1.5 rounded">
          <label htmlFor='input-image' className="cursor-pointer">
            <UploadImageIcon />
          </label>
          <input className='hidden' id='input-image' type='file' accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleChangeFile(e, TYPE_MESSAGE.IMAGE)}></input>
        </div>
        {/* <div className="cursor-pointer duration-300 hover:bg-gray2 p-1.5 rounded">
          <label htmlFor='input-file' className="cursor-pointer">
            <UploadFileIcon />
          </label>
          <input className='hidden' id='input-file' type='file'></input>
        </div> */}
      </div>
      {
        replyMessage &&
        <div className="bg-pink1 p-2 mb-2">
          <div className={classNames("border-l-4 border-primary pl-2 relative", {
            "flex items-center space-x-2": replyMessage?.type === TYPE_MESSAGE.IMAGE || replyMessage?.type === TYPE_MESSAGE.IMAGE_LIST
          })}>
            {
              replyMessage?.type === TYPE_MESSAGE.IMAGE &&
              <div>
                <img className="min-w-12 w-12 h-12 object-cover" src={replyMessage.content}></img>
              </div>
            }
            {
              replyMessage?.type === TYPE_MESSAGE.IMAGE_LIST &&
              <div>
                <img className="min-w-12 w-12 h-12 object-cover" src={replyMessage.content.split(',')[0]}></img>
              </div>
            }
            <div>
              <p className="text-sm font-semibold">{replyMessage.sender.name}</p>
              <p className="line-clamp-1 text-ellipsis pr-2 text-sm text-gray3">
                {replyMessage.type === TYPE_MESSAGE.IMAGE ? t('image') : replyMessage.content}
              </p>
            </div>
            <div
              className="absolute right-2 top-0 cursor-pointer text-2 text-white rounded-full bg-gray1 w-5 h-5 flex items-center justify-center"
              onClick={handleClearReply}
            >
              <CloseIcon />
            </div>
          </div>
        </div>
      }
      <div className="flex items-center space-x-4 px-4">
        <Input ref={inputRef} className="p-4 pl-0" placeholder={t('type_message')} value={valueInput} onChange={handleChange} onKeyPress={handleKeyPress} autoFocus />
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
      {
        Object.values(uploadImage).length > 0 &&
        <div className="border-t border-gray2 mb-4 px-4 flex flex-wrap items-center">
          {
            Object.values(uploadImage).map((img: ImageData) => (
              <div key={img.id} className="relative mt-4 mr-4">
                <img className="w-20 h-20 rounded-lg object-cover border border-gray2" src={img.urlLocal || img.url} width='100px' height='100px' />
                <div className="absolute right-1 top-1 text-2 text-black bg-gray2 border border-white rounded-full p-0.5 cursor-pointer duration-300 hover:bg-primary hover:text-white">
                  {
                    !img.url ? <p>Loading...</p> :
                    <div onClick={() => handleRemoveImage(img.id)}>
                      <CloseIcon />
                    </div>
                  }
                </div>
              </div>
            ))
          }
        </div>
      }
    </div>
  );
};

export default TypeMessage;
