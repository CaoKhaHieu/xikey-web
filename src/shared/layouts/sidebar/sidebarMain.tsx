import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ListChat from "./components/list-chat";
import Input from "@/shared/components/input";
import SearchIcon from "@/assets/icons/search.svg?react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@/shared/components/tabs";
import { User } from "@/shared/models/User";
import { getAllConversation } from "@/stores/conversation/action";

const SidebarMain = () => {
  const [valueInput, setValueInput] = useState<string>("");

  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.id) {
      return;
    }
    handleGetAllConversation();
  }, [user]);

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);
  };

  const handleGetAllConversation = () => {
    dispatch(getAllConversation());
  };

  return (
    <div className="w-87.5 h-screen border border-r-gray2">
      <div className="flex flex-col">
        <div className="px-1">
          <div className="flex justify-center items-center w-full border border-gray2 rounded-lg mt-2 mb-4 overflow-hidden">
            <Input
              variant="search"
              placeholder={t("search")}
              onChange={handleChangeInput}
              value={valueInput}
            ></Input>
            <div className="text-black1 text-2xl mr-2">
              <SearchIcon />
            </div>
          </div>
        </div>

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
              <ListChat />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default SidebarMain;
