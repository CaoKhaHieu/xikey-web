import { useSelector } from "react-redux";
import { User } from "@/shared/models/User";
import ChatItem from "../chat-item";

const ListChat = () => {
  const { sidebar }: { sidebar: any } = useSelector((state: any) => state.userReducer);

  return (
    <div className="flex flex-col overflow-y-scroll h-[calc(100vh-103px)]">
      {sidebar?.allUsers.map((user: User) => (
        <ChatItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default ListChat;
