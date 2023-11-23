import React from "react";

import Message from "@/shared/components/message";
import { IMessage } from "@/shared/models/Message";
import { TYPE_MESSAGE } from "@/shared/enums";

const data: IMessage[] = [
  {
    id: "1",
    fromId: "1997",
    toId: "8",
    type: TYPE_MESSAGE.TEXT,
    content: "Hello",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "2",
    fromId: "1997",
    toId: "8",
    type: TYPE_MESSAGE.TEXT,
    content: "Hello",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "3",
    fromId: "8",
    toId: "1997",
    type: TYPE_MESSAGE.TEXT,
    content: "Hello",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "4",
    fromId: "8",
    toId: "1997",
    type: TYPE_MESSAGE.TEXT,
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "4",
    fromId: "8",
    toId: "1997",
    type: TYPE_MESSAGE.IMAGE,
    content: "https://picsum.photos/536/354",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "4",
    fromId: "1997",
    toId: "8",
    type: TYPE_MESSAGE.IMAGE,
    content: "https://picsum.photos/530/354",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
  {
    id: "4",
    fromId: "1997",
    toId: "8",
    type: TYPE_MESSAGE.TEXT,
    content: "http://localhost:5173/",
    isLatest: false,
    isSeen: true,
    createdAt: "1700250564066",
    timestamp: "1700250564066",
  },
];

const ChatMain = () => {
  return (
    <div className="h-full p-4 bg-black1 overflow-y-scroll">
      <div className="flex flex-col space-y-4">
        {data.length > 0 &&
          data.map((message: IMessage) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
    </div>
  );
};

export default ChatMain;
