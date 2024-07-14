import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import SidebarMain from "./sidebarMain";
import Avatar from "@/shared/components/avatar";
import { IMenuData, Menu, MenuItem } from "@/shared/components/menu";
import DynamicPopover from "@/shared/components/popover";
import { logout } from "@/stores/auth/actions";
import { getRefreshToken, removeToken } from "@/shared/utils/utils";
import { updateAvatar } from "@/stores/user/action";
import { upload } from "@/stores/common/actions";
import { useDialog } from "@/shared/components/dialog";
import AccountInfo from "@/shared/components/dialog/templates/AccountInfo";

import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";

import MessageIcon from "@/assets/icons/message.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";
import SettingIcon from "@/assets/icons/setting.svg?react";
import { useDevice } from "@/shared/contexts/device-context";

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
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation }: { currentConversation: Conversation } = conversation;

  const [avatarLocal, setAvatarLocal] = useState<string>(user?.avatar);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { appendDialog } = useDialog();
  const { isMobile } = useDevice();

  useEffect(() => {
    if (user?.avatar) {
      setAvatarLocal(user?.avatar);
    }
  }, [user?.id]);

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

  const handleOpenDialogUpdateInfo = () => {
    appendDialog(
      <AccountInfo />
    );
  };

  return (
    <div className={classNames("flex", {
      'hidden': currentConversation.id && isMobile,
      'w-full': !currentConversation.id && isMobile,
    })}>
      <div className="w-14 h-screen flex flex-col border-r border-gray2">
        <div className="mt-4">
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
            className="mx-auto cursor-pointer !w-8 !h-8"
            url={avatarLocal}
            onClick={handleAvatarClick}
          />
        </div>
        <div className="flex flex-col h-full">
          <Menu className="flex flex-col items-center space-y-2 mt-4">
            <>
              {menu.map((item: IMenuData) => (
                <MenuItem
                  key={item.id}
                  className={classNames(
                    "text-3xl p-3 rounded-lg flex justify-center items-center hover:bg-gray8",
                    {
                      "text-black1 bg-gray8": item.active,
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
                      className='p-3 rounded-lg flex justify-center items-center hover:bg-gray8'
                      menu={item}
                    />
                  }
                  content={
                    <div className="shadow-2xl bg-white px-8 py-3 w-44 border border-gray2 rounded-md flex flex-col space-y-2">
                      <p className="text-sm cursor-pointer whitespace-nowrap">{t('account_settings')}</p>
                      <p className="text-sm cursor-pointer whitespace-nowrap">{t('introduce')}</p>
                      <p className="text-sm cursor-pointer whitespace-nowrap" onClick={handleOpenDialogUpdateInfo}>{t('update_account')}</p>
                      <p className="text-sm cursor-pointer whitespace-nowrap text-red" onClick={item.onClick}>{t('logout')}</p>
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
