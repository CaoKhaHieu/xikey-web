import ChatIcon from "@/assets/icons/chat.svg?react";
import { getPinedMessages } from "@/stores/message/action";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PinMessages = () => {
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetListPinedMessages();
  }, []);

  const handleGetListPinedMessages = () => {
    const params = {
      conversationId: id,
    };
    console.log({params})
    dispatch(getPinedMessages(params, (data: any) => {
      console.log(data)
    }, () => {
    }));
  };

  return (
    <div className='py-2 px-4 flex items-center space-x-3'>
      <div>
        <ChatIcon  />
      </div>
      <div className='flex flex-col justify-center'>
        <p className="text-sm">{t('message')}</p>
        <p className='line-clamp-1 text-xs'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis reiciendis repellat, animi libero aspernatur voluptates expedita ea officia itaque illo eveniet accusamus pariatur asperiores! Dolorum ad labore magnam id consequatur!
        </p>
      </div>
      <div className='text-primaryHover text-sm whitespace-nowrap cursor-pointer duration-300 hover:underline'>
        Show more
      </div>
    </div>
  );
};

export default PinMessages;
