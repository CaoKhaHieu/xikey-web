import { TYPE_MESSAGE } from "../enums";

export interface IMessage {
  id: string;
  fromId: string;
  toId: string;
  type: TYPE_MESSAGE
  content: string;
  isLatest: boolean;
  isSeen: boolean;
  createdAt: string;
  timestamp: string;
}
