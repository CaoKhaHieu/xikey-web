import { useRef, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import SidebarMain from "./sidebarMain";
import Avatar from "@/shared/components/avatar";
import { IMenuData, Menu, MenuItem } from "@/shared/components/menu";

import MessageIcon from "@/assets/icons/message.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";
import SettingIcon from "@/assets/icons/setting.svg?react";
import DynamicPopover from "@/shared/components/popover";
import { logout } from "@/stores/auth/actions";
import { getRefreshToken, removeToken } from "@/shared/utils/utils";
import { User } from "@/shared/models/User";
import { updateAvatar } from "@/stores/user/action";
import { upload } from "@/stores/common/actions";

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

const Sidebar = () => {
  const popoverRef: any = useRef();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const [avatarLocal, setAvatarLocal] = useState<string>(user?.avatar);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    const refreshToken = {
      refreshToken: getRefreshToken()
    };
    dispatch(logout(refreshToken, () => {
      removeToken();
      window.location.reload();
    }, () => {
    }))
  };

  const menuBottom: IMenuData[] = [
    {
      id: 1,
      tooltip: "",
      icon: <SettingIcon />,
      active: false,
      onClick: handleLogout,
    },
  ];

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    };

    const file: File = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
    setAvatarLocal(reader.result as string);
    };

    let formData = new FormData()
    formData.append("image", file);

    dispatch(upload(formData, (res: { url: string}) => {
      dispatch(updateAvatar(res, () => {
      }, () => {
      }));
    }, () => {
    }));
  };

  const handleAvatarClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex">
      <div className="w-16 bg-black1 h-screen flex flex-col">
        <div className="mt-8 mb-4">
          <div className="hidden">
            <input
              ref={inputRef}
              type="file"
              id="input_file"
              defaultValue=""
              onChange={handleFileInputChange}
            ></input>
          </div>
          <Avatar
            className="mx-auto cursor-pointer"
            url={avatarLocal}
            isUpload
            onClick={handleAvatarClick}
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
                <DynamicPopover
                  key={item.id}
                  ref={ popoverRef }
                  positions={['right', 'top']}
                  triggerElm={
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
                  }
                  content={
                    <div className="shadow-2xl bg-white px-8 py-3 w-44 border border-gray2 rounded-md flex flex-col space-y-2">
                      <p className="text-sm cursor-pointer">{t('account_settings')}</p>
                      <p className="text-sm cursor-pointer">{t('introduce')}</p>
                      <p className="text-sm cursor-pointer text-red" onClick={item.onClick}>{t('logout')}</p>
                    </div>
                  }
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
