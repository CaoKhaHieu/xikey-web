import { Message } from "./Message";

export interface Link {
  id: string;
  title: string;
  link: string
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  members: string[];
  lastMessage: Message;
  pinedMessages: Message[];
  updatedAt: string;
  isGroup: boolean;
  isCloud: boolean;
  ownerId: string;
  links: Link[];
  bannedMembers: string[];
}

export class Conversation {
  constructor (conversation: any) {
    this.id = conversation.id;
    this.avatar = conversation.avatar;
    this.name = conversation.name;
    this.members = conversation.members;
    this.lastMessage = conversation.lastMessage;
    this.updatedAt = conversation.updatedAt;
    this.isGroup = conversation.isGroup || this.members?.length > 2;
    this.isCloud = conversation.isCloud || false;
    this.ownerId = conversation.ownerId || '';
    this.links = conversation.links?.map((link: any) => ({
      id: link._id,
      title: link.title,
      link: link.link
    })) || [];
    this.bannedMembers = conversation.bannedMembers || [];
  }
}
