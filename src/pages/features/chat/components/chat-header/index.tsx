import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useDialog } from "@/shared/components/dialog";
import Avatar from "@/shared/components/avatar";
import Tooltip from "@/shared/components/tooltip";
import { Conversation } from "@/shared/models/Conversation";
import ConversationInfo from "@/shared/components/dialog/templates/ConversationInfo";
import { toggleSidebarRight } from "@/stores/common/actions";
import { User } from "@/shared/models/User";
import { clearCurrentConversation } from "@/stores/conversation/action";
import { useDevice } from "@/shared/contexts/device-context";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

import SearchIcon from "@/assets/icons/search.svg?react";
import LinkIcon from "@/assets/icons/links.svg?react";
import PinIcon from "@/assets/icons/pin.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import CallIcon from "@/assets/icons/call.svg?react";
import CameraIcon from "@/assets/icons/camera.svg?react";
import Icon from "@/shared/components/icon";
import BackIcon from "@/assets/icons/back.svg?react";

const ChatHeader = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation }: { currentConversation: Conversation } = conversation;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();
  const { isMobile } = useDevice();
  const dispatch = useDispatch();

  // use ? because user model in BE does not have field userChat, when use updateInfoConversation() -> bug systax error
  const { online } = useOnlineStatus(currentConversation?.userChat?.online, currentConversation?.userChat?.id);
    
  const handleWatchInfoConversation = () => {
    appendDialog(
      <ConversationInfo conversation={currentConversation} />
    );
  };

  const handleOpenSidebarRight = () => {
    dispatch(toggleSidebarRight(true));
  };

  const handleBackToListConversation = () => {
    dispatch(clearCurrentConversation());
  };

  return (
    <div className="flex items-center bg-white px-3 border-b border-gray2 min-h-16">
      {
        isMobile &&
        <div className="text-x mr-2" onClick={handleBackToListConversation}>
          <BackIcon />
        </div>
      }

      <div className="flex items-center flex-1 space-x-4">
        <Avatar
          className="cursor-pointer"
          url={currentConversation?.avatar}
          online={online}
          onClick={handleWatchInfoConversation}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-lg text-black1 line-clamp-1">{currentConversation?.name}</p>
          <div className="flex space-x-2">
            <Tooltip
              className='z-10'
              wrapperClassName="w-fit"
              id='links'
              content={t('pin_messages')}
            >
              <div className="cursor-pointer" onClick={handleOpenSidebarRight}>
                <PinIcon />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center space-x-4">
        <div className="text-2xl cursor-pointer">
          <Icon icon={<CallIcon />} />
        </div>
        <div className="text-2xl cursor-pointer">
          <Icon icon={<CameraIcon />} />
        </div>
        <div className="text-2xl cursor-pointer">
          <Icon icon={<InfoIcon />} />
        </div>
      </div> */}
    </div>
  );
};

export default ChatHeader;
