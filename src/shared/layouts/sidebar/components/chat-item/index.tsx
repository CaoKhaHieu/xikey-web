import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";

interface IUserSidebar {
  user: User;
}

const ChatItem = (props: IUserSidebar) => {
  const { user } = props;

  return (
    <div className="flex p-2 cursor-pointer hover:bg-gray2 duration-300">
      <div>
        <Avatar className="" url={user.avatar} />
      </div>
      <div className="flex-1 ml-2">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className="text-black1 text-base line-clamp-1">
            {user.name}
          </div>
          <p className="whitespace-nowrap text-sm text-gray3">1h ago</p>
        </div>

        {/* bottom */}
        <div className="flex justify-between">
          <p className="text-sm text-gray3 line-clamp-1">
            Xin Chao Cac quy vi khan gia cua vtv3, toi la hiue cao
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
