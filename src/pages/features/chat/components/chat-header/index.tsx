import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useDialog } from "@/shared/components/dialog";
import Avatar from "@/shared/components/avatar";
import Tooltip from "@/shared/components/tooltip";
import { Conversation } from "@/shared/models/Conversation";
import ConversationInfo from "@/shared/components/dialog/templates/ConversationInfo";
import LinksDialog from "@/shared/components/dialog/templates/LinksDialog";
import { toggleSidebarRight } from "@/stores/common/actions";
import { User } from "@/shared/models/User";
import { isMobile } from "@/shared/utils/utils";
import { clearCurrentConversation } from "@/stores/conversation/action";

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
  const dispatch = useDispatch();

  const handleWatchInfoConversation = () => {
    appendDialog(
      <ConversationInfo conversation={currentConversation} />
    );
  };

  const handleOpenLinksDialog = () => {
    appendDialog(
      <LinksDialog onClick={() => {}} />
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
        isMobile() &&
        <div className="text-x mr-2" onClick={handleBackToListConversation}>
          <BackIcon />
        </div>
      }

      <div className="flex items-center flex-1 space-x-4">
        <Avatar className="cursor-pointer" url={currentConversation?.avatar} onClick={handleWatchInfoConversation} />
        <div className="flex flex-col">
          <p className="font-semibold text-lg text-black1 line-clamp-1">{currentConversation?.name}</p>
          <div className="flex space-x-2">
            {
              user.isAdmin &&
                <Tooltip
                  className=''
                  wrapperClassName="w-fit"
                  id='links'
                  content={t('links')}
                >
                  <p className="text-black flex items-center space-x-1 w-fit cursor-pointer font-bold" onClick={handleOpenLinksDialog}>
                    <LinkIcon />
                  </p>
                </Tooltip>
            }
            <Tooltip
              className=''
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
