import classNames from "classnames";
import SidebarMain from "./sidebarMain";

import Avatar from "@/shared/components/avatar";
import { IMenuData, Menu, MenuItem } from "@/shared/components/menu";

import MessageIcon from "@/assets/icons/message.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";
import SettingIcon from "@/assets/icons/setting.svg?react";

const menu: IMenuData[] = [
  {
    id: 1,
    tooltip: "",
    icon: <MessageIcon />,
    active: true,
  },
  {
    id: 2,
    tooltip: "",
    icon: <CheckIcon />,
    active: false,
  },
];

const menuBottom: IMenuData[] = [
  {
    id: 1,
    tooltip: "",
    icon: <SettingIcon />,
    active: false,
  },
];

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-16 bg-black1 h-screen flex flex-col">
        <div className="mt-8 mb-4">
          <Avatar
            className="mx-auto"
            url="https://picsum.photos/200/200"
          />
        </div>

        <div className="flex flex-col h-full">
          <Menu className="flex flex-col items-center mt-4">
            <>
              {menu.map((item: IMenuData) => (
                <MenuItem
                  key={item.id}
                  className={classNames(
                    "text-3xl w-full h-16 flex justify-center items-center",
                    {
                      "text-white": !item.active,
                      "text-black1 bg-primary": item.active,
                    }
                  )}
                  menu={item}
                />
              ))}
            </>
          </Menu>

          <Menu className="flex flex-col items-center mt-auto">
            <>
              {menuBottom.map((item: IMenuData) => (
                <MenuItem
                  key={item.id}
                  className={classNames(
                    "text-white text-3xl w-full h-16 flex justify-center items-center",
                    {
                      "text-black1 bg-primary": item.active,
                    }
                  )}
                  menu={item}
                />
              ))}
            </>
          </Menu>
        </div>
      </div>
      <SidebarMain />
    </div>
  );
};

export default Sidebar;
