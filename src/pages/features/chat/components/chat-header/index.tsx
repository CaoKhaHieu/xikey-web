import Avatar from "@/shared/components/avatar";
import { useChat } from "@/shared/contexts/chat-context";
import { useDialog } from "@/shared/components/dialog";
import ConversationInfo from "@/shared/components/dialog/templates/ConversationInfo";

import SearchIcon from "@/assets/icons/search.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import CameraIcon from "@/assets/icons/camera.svg?react";
import Icon from "@/shared/components/icon";

const ChatHeader = () => {
  const { selectedChat } = useChat();
  const { appendDialog } = useDialog();

  const handleWatchInfoConversation = () => {
    appendDialog(
      <ConversationInfo conversation={selectedChat} />
    );
  };

  return (
    <div className="flex items-center bg-white px-4 border-b border-gray2 h-20">
      <div className="flex items-center flex-1 space-x-4">
        <Avatar className="cursor-pointer" url={selectedChat?.avatar} onClick={handleWatchInfoConversation} />
        <p className="font-semibold text-lg text-black1">{selectedChat?.name}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-2xl cursor-pointer">
          <Icon icon={<SearchIcon />} />
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
