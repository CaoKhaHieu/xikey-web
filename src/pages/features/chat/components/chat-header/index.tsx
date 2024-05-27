import Avatar from "@/shared/components/avatar";
import { useSelector } from "react-redux";
import { useDialog } from "@/shared/components/dialog";
import ConversationInfo from "@/shared/components/dialog/templates/ConversationInfo";

import SearchIcon from "@/assets/icons/search.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import CallIcon from "@/assets/icons/call.svg?react";
import CameraIcon from "@/assets/icons/camera.svg?react";
import Icon from "@/shared/components/icon";

const ChatHeader = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const { appendDialog } = useDialog();

  const handleWatchInfoConversation = () => {
    appendDialog(
      <ConversationInfo conversation={currentConversation} />
    );
  };

  return (
    <div className="flex items-center bg-white px-3 border-b border-gray2 min-h-16">
      <div className="flex items-center flex-1 space-x-2">
        <Avatar className="cursor-pointer !w-10 !h-10" url={currentConversation?.avatar} onClick={handleWatchInfoConversation} />
        <p className="font-medium text-black1 line-clamp-1">{currentConversation?.name}</p>
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
