import React, { useEffect, useRef, useState, ClipboardEventHandler } from "react";
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
import { BASE_URL, VALIDATE_LENGTH } from "@/shared/constants";
import { showToast } from "@/shared/utils/utils";
import { clearReplyMessage, createMessage, saveNewMessage, triggerAlertNewMessage, triggerScrollToEndListMessage } from "@/stores/message/action";

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
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<any>();
  const valueInputRef = useRef<string>('');
  const countUploadImagesRef = useRef<number>(listImg.length);

  const { id }: { id: string } = currentConversation;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const replyMessage: Message = messageManagement.reply[id];

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

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    const items = (event.clipboardData || (event as any).originalEvent.clipboardData).items;
    let isText = false;
    let isImage = false;

    for (let index in items) {
      const item = items[index];
      if (item.kind === 'string' && item.type === 'text/plain') {
        isText = true;
      } else if (item.kind === 'file' && item.type.includes('image')) {
        isImage = true;
      }
    }

    // cehck is text content
    if (isText) {
      const text = event.clipboardData.getData('text/plain');
      if (text.startsWith(`${BASE_URL}/uploads`)) {
        setUploadImage((prev) => ({
          ...prev,
          [id]: {
            url: text,
            urlLocal: '',
            id,
          }
        }));
        return event.preventDefault();
      }
    }

    if (isImage) {
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          // limit image
          if (countUploadImagesRef.current >= VALIDATE_LENGTH.LIMIT_IMAGES) {
            showToast(t('limit_image_upload'));
            return;
          }
  
          const file: File | null = item.getAsFile();
          if (!file) {
            return;
          }
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if(e.key == 'Enter' && !e.shiftKey){
      const isUploadingImage = listImg.length && listImg.find((image: ImageData) => !image.url);
      if (listImg.length > 0 && isUploadingImage) {
        showToast(t('uploading_image'));
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
    const virtualId = Date.now();
    const body = {
      conversationId: id,
      sender: user.id,
      content: message || valueInput,
      type,
      replyMessage: isImageMessage ? undefined : replyMessage?.id,
      virtualId,
    };
    if (!body.content) {
      return;
    }
    const messageData = new Message({
      id: virtualId,
      virtualId,
      conversationId: id,
      sender: user,
      content: message || valueInput,
      isNew: true,
      createdAt: Date.now(),
      type,
      isSending: true,
      replyMessage: !isImageMessage && replyMessage?.id && new Message(replyMessage)
    });

    // handle send message
    dispatch(saveNewMessage(messageData));
    // handle scroll list message to end
    dispatch(triggerScrollToEndListMessage());
    // handle show alert new message
    dispatch(triggerAlertNewMessage({ type: 'INCREASE' }));

    setValueInput('');
    setIsOpenModalIcon(false);
    valueInputRef.current = '';
    !isImageMessage && dispatch(clearReplyMessage({ conversationId: id }));
    dispatch(createMessage(body, () => {
    }, () => {}));
  };

  const handleChangeFile = (e: any, type: TYPE_MESSAGE) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

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
    <div className="flex flex-col mx-3 my-2.5 rounded-xl border border-gray2">
      {
        replyMessage &&
        <div className="p-2">
          <div className={classNames("border-l-4 border-primary pl-1.5 relative", {
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
              className="absolute right-2 top-0 cursor-pointer text-2 text-black rounded-full w-5 h-5 flex items-center justify-center"
              onClick={handleClearReply}
            >
              <CloseIcon />
            </div>
          </div>
        </div>
      }
      <div className="flex items-center space-x-2 px-2 pt-1">
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
      <div className="flex items-center space-x-4 px-4">
        <Input
          ref={inputRef}
          className="px-4 pt-2 pb-4 pl-0"
          placeholder={t('type_message')}
          value={valueInput}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          autoFocus
        />
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
        <div className="mb-4 px-4 flex flex-wrap items-center">
          {
            Object.values(uploadImage).map((img: ImageData) => (
              <div key={img.id} className="relative mr-4">
                <img className="w-20 h-20 rounded-lg object-cover border border-gray2" src={img.urlLocal || img.url} width='100px' height='100px' />
                <div className="absolute right-1 top-1 text-2 text-black bg-gray2 border border-white rounded-full p-1 cursor-pointer duration-300 hover:bg-primaryHover hover:text-white">
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
