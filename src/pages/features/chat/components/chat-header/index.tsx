import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useDialog } from "@/shared/components/dialog";
import Avatar from "@/shared/components/avatar";
import Tooltip from "@/shared/components/tooltip";
import { Conversation } from "@/shared/models/Conversation";
import ConversationInfo from "@/shared/components/dialog/templates/ConversationInfo";
import LinksDialog from "@/shared/components/dialog/templates/LinksDialog";

import SearchIcon from "@/assets/icons/search.svg?react";
import LinkIcon from "@/assets/icons/links.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import CallIcon from "@/assets/icons/call.svg?react";
import CameraIcon from "@/assets/icons/camera.svg?react";
import Icon from "@/shared/components/icon";
import { User } from "@/shared/models/User";

const ChatHeader = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation }: { currentConversation: Conversation } = conversation;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();

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

  return (
    <div className="flex items-center bg-white px-3 border-b border-gray2 h-20">
      <div className="flex items-center flex-1 space-x-2">
        <Avatar className="cursor-pointer !w-10 !h-10" url={currentConversation?.avatar} onClick={handleWatchInfoConversation} />
        <div className="flex flex-col">
          <p className="font-medium text-black1 line-clamp-1">{currentConversation?.name}</p>
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
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-2xl cursor-pointer">
          <Icon icon={<CallIcon />} />
        </div>
        <div className="text-2xl cursor-pointer">
          <Icon icon={<CameraIcon />} />
        </div>
        <div className="text-2xl cursor-pointer">
          <Icon icon={<InfoIcon />} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
