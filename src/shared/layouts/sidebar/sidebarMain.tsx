import React, { useState } from "react";
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

const SidebarMain = () => {
  const [valueInput, setValueInput] = useState<string>("");
  const { t } = useTranslation();

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);
  };

  return (
    <div className="w-87.5 h-screen border border-r-gray2">
      <div className="flex flex-col">
        <div className="px-1">
          <div className="flex justify-center items-center w-full border border-gray2 rounded-lg mt-2 mb-4 overflow-hidden">
            <Input
              className=""
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
