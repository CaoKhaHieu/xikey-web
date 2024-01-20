import classNames from "classnames";

import { IMessage } from "@/shared/models/Message";
import { TYPE_MESSAGE } from "@/shared/enums";
import { urlify } from "@/shared/utils/utils";

interface MessageOptions {
  message: IMessage;
}

const Message = (props: MessageOptions) => {
  const { message } = props;
  const userId = 8;

  return (
    <div
      className={classNames("px-6 py-4 w-fit rounded-lg max-w-7/10", {
        "ml-auto bg-gray4": userId === +message.fromId,
        "bg-white": userId !== +message.fromId,
        "!bg-transparent !p-0": message.type === TYPE_MESSAGE.IMAGE
      })}
    >
      {
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
      )}
    </div>
  );
};

export default Message;
