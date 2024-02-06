import { useSelector } from "react-redux";
import classNames from "classnames";

import Avatar from "../avatar";
import { User } from "@/shared/models/User";
import { useChat } from "@/shared/contexts/chat-context";
import { formatTimeToHHMM, isOnlyEmoji, urlify } from "@/shared/utils/utils";
import { Message as MessageModel } from "@/shared/models/Message";
import { TYPE_MESSAGE } from "@/shared/enums";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
  onScrollEnd: () => void;
}

const Message = (props: MessageOptions) => {
  const { message, showAvatar, onScrollEnd } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const { selectedChat } = useChat();
  const isCurrentUser = user.id === message.sender;
  const isOnlyEmojiMessage = isOnlyEmoji(message.content);

  return (
    <div className="flex space-x-2 h-full">
      {
        !isCurrentUser && showAvatar &&
        <Avatar className="w-10 h-10" url={selectedChat.avatar} />
      }
      <div
        className={classNames("p-2.5 min-w-20 rounded-lg max-w-7/10 h-full", {
          "ml-auto bg-gray4": isCurrentUser,
          "bg-white mr-auto": !isCurrentUser,
          "ml-14": !isCurrentUser,
          "!p-0 !bg-transparent": message.type === TYPE_MESSAGE.IMAGE
        })}
      >
        {
          message.type === TYPE_MESSAGE.TEXT &&
          <span className={classNames({
            "text-2xl": isOnlyEmojiMessage
          })} dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
          </span>
        }
        {
          message.type === TYPE_MESSAGE.IMAGE &&
          <a href={message.content} className="cursor-pointer" target="_blank">
            <img
              className="rounded-lg bg-white"
              src={message.content}
              onLoad={onScrollEnd}
            ></img>
          </a>
        }
        <p className={classNames("text-xs mt-2", {
          "text-gray7": message.type === TYPE_MESSAGE.TEXT,
          "text-white": message.type === TYPE_MESSAGE.IMAGE
        })}>
          {
            formatTimeToHHMM(message.createdAt)
          }
        </p>
        {/* {
          message.type === TYPE_MESSAGE.TEXT && (
            <span dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
            </span>
          )
        } */}
      </div>
    </div>
  );
};

export default Message;
