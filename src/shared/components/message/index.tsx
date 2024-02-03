import { useSelector } from "react-redux";
import classNames from "classnames";

import Avatar from "../avatar";
import { User } from "@/shared/models/User";
import { useChat } from "@/shared/contexts/chat-context";
import { formatTimeToHHMM, urlify } from "@/shared/utils/utils";
import { Message as MessageModel } from "@/shared/models/Message";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
}

const Message = (props: MessageOptions) => {
  const { message, showAvatar } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const { selectedChat } = useChat();
  const isCurrentUser = user.id === message.sender;

  return (
    <div className="flex space-x-2">
      {
        !isCurrentUser && showAvatar &&
        <Avatar className="w-10 h-10" url={selectedChat.avatar} />
      }
      <div
        className={classNames("p-2.5 min-w-20 rounded-lg max-w-7/10", {
          "ml-auto bg-gray4": isCurrentUser,
          "bg-white mr-auto": !isCurrentUser,
          "ml-12": !isCurrentUser,
          // "!bg-transparent !p-0": message.type === TYPE_MESSAGE.IMAGE
        })}
      >
        <span dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
        </span>
        <p className="text-xs text-gray7 mt-2">
          {
            formatTimeToHHMM(message.createdAt)
          }
        </p>
        {/* {
          message.type === TYPE_MESSAGE.TEXT && (
            <span dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
            </span>
          )
        }
        {message.type === TYPE_MESSAGE.IMAGE && (
          <img
            className="rounded-lg"
            src={message.content}
          ></img>
        )} */}
      </div>
    </div>
  );
};

export default Message;
