import { useSelector } from "react-redux";
import classNames from "classnames";

import { Message as MessageModel } from "@/shared/models/Message";
import { TYPE_MESSAGE } from "@/shared/enums";
import { urlify } from "@/shared/utils/utils";
import { User } from "@/shared/models/User";

interface MessageOptions {
  message: MessageModel;
}

const Message = (props: MessageOptions) => {
  const { message } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  return (
    <div
      className={classNames("px-6 py-4 w-fit rounded-lg max-w-7/10", {
        "ml-auto bg-gray4": user.id === message.sender,
        "bg-white": user.id !== message.sender,
        // "!bg-transparent !p-0": message.type === TYPE_MESSAGE.IMAGE
      })}
    >
      <span dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
      </span>
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
  );
};

export default Message;
