export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  online: boolean;
  conversationId: string;
}

export class User {
  constructor (user: any) {
    this.id = user.id;
    this.email = user.email;
    this.avatar = user.avatar;
    this.name = user.name;
    this.online = user.online || false;
    this.conversationId = user.conversationId;
  }
}
