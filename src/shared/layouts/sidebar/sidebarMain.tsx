import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import ListChat from "./components/list-chat";
import Input from "@/shared/components/input";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@/shared/components/tabs";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { searchUser } from "@/stores/user/action";
import Avatar from "@/shared/components/avatar";
import Button from "@/shared/components/button";
import { useDialog } from "@/shared/components/dialog";
import { createConversation, getAllConversation, saveAllConversations } from "@/stores/conversation/action";

import SearchIcon from "@/assets/icons/search.svg?react";
import SearchUserIcon from "@/assets/icons/search-user.svg?react";
import GroupIcon from "@/assets/icons/group.svg?react";
import CreateGroup from "@/shared/components/dialog/templates/CreateGroup";


const SidebarMain = () => {
  const [valueInput, setValueInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef(0);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { appendDialog } = useDialog();

  useEffect(() => {
    if (!user.id) {
      return;
    }
    handleGetAllConversation();
  }, [user]);

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (!value) {
        setUsers([]);
        return;
      }
      handleSearchUser(value);
    }, 300);
  };

  const handleGetAllConversation = () => {
    dispatch(getAllConversation());
  };

  const handleSearchUser = (name: string) => {
    const body = {
      name,
    };
    dispatch(searchUser(body, (res: User[]) => {
      setUsers(res);
    }, () => {
    }));
  };

  const handleRedirectToConversation = (conversationId: string, userSearch: User) => {
    if (conversationId) {
      history.push(`/chat/${conversationId}`);
      setIsFocused(false);
      return;
    }
    // create new conversaton
    const body = {
      members: [userSearch.id, user.id],
    };
    dispatch(createConversation(body, (newConversation: Conversation) => {
      dispatch(saveAllConversations([newConversation, ...listConversations]));
      history.push(`/chat/${newConversation.id}`);
    }, () => {
    }));
  };

  const handleOpenDialogCreateGroup = () => {
    appendDialog(
      <CreateGroup />
    );
  };

  return (
    <div className="w-87.5 h-screen border-r border-gray2">
      <div className="flex flex-col">
        <div className="px-1 flex items-center space-x-2">
          <div className="flex justify-center items-center w-full border border-gray2 rounded-lg my-2 overflow-hidden">
            <Input
              ref={inputRef}
              variant="search"
              placeholder={t("search")}
              onChange={handleChangeInput}
              value={valueInput}
              onFocus={() => setIsFocused(true)}
            ></Input>
            <div className="text-black1 text-2xl mr-2">
              <SearchIcon />
            </div>
          </div>
          <div
            className="cursor-pointer hover:bg-pink1 text-2xl p-2 rounded"
            hidden={isFocused}
            onClick={handleOpenDialogCreateGroup}
          >
            <GroupIcon />
          </div>
          {
            isFocused &&
            <div>
              <Button className="!bg-gray1 outline-none text-white px-4 py-1.5 rounded" onClick={() => setIsFocused(false)}>{t('close')}</Button>
            </div>
          }
        </div>

        {
          isFocused &&
          <div className="flex flex-col overflow-y-scroll h-[calc(100vh-62px)]">
            {
              users.length > 0 ?
              <>
                {
                  users.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex space-x-2 items-center p-2 cursor-pointer hover:bg-gray2 duration-300"
                      onClick={() => handleRedirectToConversation(user?.conversationId, user)}
                    >
                      <Avatar className="" url={user.avatar} />
                      <p className="line-clamp-1">{user.name}</p>
                    </div>
                  ))
                }
              </> :
              <div className="flex flex-col items-center">
                <SearchUserIcon />
                <p className="font-semibold text-base">{t('no_result')}</p>
                <p className="text-base">{t('try_again')}</p>
              </div>
            }
          </div>
        }

        <div hidden={isFocused}>
          <Tabs defaultTab={0}>
            <TabList>
              <Tab>
                <p>{t("all")}</p>
              </Tab>
              <Tab>
                <p>{t("unread")}</p>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ListChat />
              </TabPanel>
              <TabPanel>
                {/* <ListChat /> */}
                <></>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SidebarMain;
