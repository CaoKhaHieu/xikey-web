import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

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
import { useDialog } from "@/shared/components/dialog";
import { createConversation, getAllConversation, getAllGroupConversation, saveAllConversations, selectConversation } from "@/stores/conversation/action";

import SearchIcon from "@/assets/icons/search.svg?react";
import GroupIcon from "@/assets/icons/group.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";
import CreateGroup from "@/shared/components/dialog/templates/CreateGroup";
import ChatSkeleton from "@/shared/components/skeleton/chat-skeleton";
import Tooltip from "@/shared/components/tooltip";

const SidebarMain = () => {
  const [valueInput, setValueInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageRef = useRef<number>(page);

  const [users, setUsers] = useState<User[]>([]);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(0);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { appendDialog } = useDialog();

  useEffect(() => {
    if (!user.id) {
      return;
    }
    if (user.isAdmin) {
      handleGetAllConversation();
    } else {
      handleGetAllGroupConversation();
    }
  }, [user.id]);

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);
    pageRef.current = 1;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (!value) {
        setUsers([]);
        return;
      }
      handleSearchUser(value.trim(), true);
    }, 300);
  };

  const handleGetAllConversation = () => {
    dispatch(getAllConversation(null, () => {
      setIsLoading(false);
    }, () => {
      setIsLoading(false);
    }));
  };

  const handleGetAllGroupConversation = () => {
    dispatch(getAllGroupConversation(null, () => {
      setIsLoading(false);
    }, () => {
      setIsLoading(false);
    }));
  };

  const handleSearchUser = (name?: string, isReset: boolean = false) => {
    const body = {
      name: name || valueInput,
      page: pageRef.current || page,
    };
    dispatch(searchUser(body, (usersResponse: User[], page: number, hasMore: boolean) => {
      if (isReset) {
        setUsers(usersResponse);
      } else {
        setUsers([...users, ...usersResponse]);
      }
      setPage(page + 1);
      setHasMore(hasMore);

      pageRef.current = page + 1;
    }, () => {
    }));
  };

  const handleRedirectToConversation = (conversationId: string, userSearch: User) => {
    if (conversationId) {
      dispatch(selectConversation(new Conversation({ id: conversationId })));
      setIsFocused(false);
      return;
    }
    // create new conversaton
    const body = {
      members: [userSearch.id, user.id],
    };
    dispatch(createConversation(body, (newConversation: Conversation) => {
      dispatch(saveAllConversations([newConversation, ...listConversations]));
      dispatch(selectConversation(newConversation));
    }, () => {
    }));
  };

  const handleOpenDialogCreateGroup = () => {
    appendDialog(
      <CreateGroup />
    );
  };

  return (
    <div className="w-full border-r-none h-screen md:border-r md:border-gray2 md:w-87.5">
      <div className="flex flex-col">
        <div className="px-1 flex items-center space-x-1">
          <div className="flex justify-center items-center w-full border border-gray2 rounded-lg my-2 overflow-hidden">
            <Tooltip
              className=''
              wrapperClassName='w-full'
              id='search_user'
              content={t(!user.isAdmin ? 'cannot_search_user' : '')}
            >
              <Input
                ref={inputRef}
                variant='search'
                placeholder={t("search")}
                onChange={handleChangeInput}
                value={valueInput}
                onFocus={() => setIsFocused(true)}
                disabled={!user.isAdmin}
              ></Input>
            </Tooltip>
            <div className="text-black1 text-2xl mr-2">
              <SearchIcon />
            </div>
          </div>
          <button
            className="cursor-pointer hover:bg-gray8 text-2xl p-2 rounded-full"
            hidden={isFocused}
            onClick={handleOpenDialogCreateGroup}
            disabled={!user.isAdmin}
          >
            <GroupIcon />
          </button>
          {
            isFocused &&
            <div
              className="outline-none text-black1 h-9 min-w-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-gray8"
              onClick={() => setIsFocused(false)}
            >
              <CloseIcon />
            </div>
          }
        </div>

        {
          isFocused &&
          <div className="flex flex-col overflow-y-scroll h-[calc(100vh-62px)] pl-1.5" id="scrollableDiv">
            <InfiniteScroll
              dataLength={users.length}
              next={handleSearchUser}
              hasMore={hasMore}
              loader={<></>}
              scrollableTarget="scrollableDiv"
            >
              {
                !users.length &&
                <div className="flex flex-col items-center mt-8">
                  <p className="font-semibold text-base">{t('no_result')}</p>
                  <p className="text-base">{t('try_again')}</p>
                </div>
              }
              {
                users.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex space-x-2 items-center p-2 cursor-pointer rounded-lg hover:bg-gray2 duration-300"
                    onClick={() => handleRedirectToConversation(user?.conversationId, user)}
                  >
                    <Avatar className="" url={user.avatar} />
                    <p className="line-clamp-1">{user.name}</p>
                  </div>
                ))
              }
            </InfiniteScroll>
          </div>
        }

        <div hidden={isFocused}>
          <Tabs defaultTab={0}>
            <TabList>
              <Tab>
                <p>{t("all")}</p>
              </Tab>
              {/* <Tab>
                <p>{t("unread")}</p>
              </Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                {
                  isLoading ?
                  <div className="flex flex-col space-y-2 p-1.5">
                    <ChatSkeleton />
                    <ChatSkeleton />
                    <ChatSkeleton />
                    <ChatSkeleton />
                    <ChatSkeleton />
                    <ChatSkeleton />
                  </div> :
                  <ListChat />
                }
              </TabPanel>
              <TabPanel>
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
