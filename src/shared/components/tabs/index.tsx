import classNames from "classnames";
import React, { ReactElement, useEffect, useRef, useState } from "react";

interface ITabs {
  children: ReactElement | ReactElement[];
  defaultTab: number;
}

interface ITabList {
  children: ReactElement | ReactElement[];
  activeTab?: number;
  changeTab?: (tab: number) => void;
}

interface ITab {
  children: ReactElement | ReactElement[];
  isActive?: boolean;
  onClick?: () => void;
  handleChangeStyleUnderLine?: (left: number, width: number) => void;
}

interface ITabPanels {
  children: ReactElement | ReactElement[];
  activeTab?: number;
}

interface ITabPanel {
  children: ReactElement | ReactElement[];
  isActive?: boolean;
}

const Tabs = (props: ITabs) => {
  const { defaultTab = 0, children } = props;
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const changeTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const tabContent = React.Children.map(children, (child: ReactElement) => {
    if (!child) {
      return null;
    }
    if (child.type === TabList) {
      return React.cloneElement(child, {
        activeTab,
        changeTab,
      });
    }
    if (child.type === TabPanels) {
      return React.cloneElement(child, {
        activeTab,
      });
    }
  });

  return <div className="tabs-sections">{tabContent}</div>;
};

const TabList = (props: ITabList) => {
  const { children, activeTab, changeTab } = props;
  const [stylesUnderLine, setStyleUnderLine] = useState({ left: 0, width: 0 });

  const handleChangeStyleUnderLine = (left: number, width: number) => {
    setStyleUnderLine({
      left,
      width,
    });
  };

  const tabs = React.Children.map(children, (child, index) => {
    if (child.type === Tab) {
      return React.cloneElement(child, {
        isActive: activeTab === index,
        onClick: () => changeTab && changeTab(index),
        index,
        handleChangeStyleUnderLine,
      });
    }
  });

  return (
    <div className="tab-list flex space-x-1 items-center border-b border-gray2 relative">
      {tabs}
      <div
        className={classNames(
          "under-line absolute bottom-0 h-0.5 bg-black1 transition-all duration-300"
        )}
        style={{
          left: `${stylesUnderLine?.left}px`,
          width: `${stylesUnderLine?.width}px`,
        }}
      ></div>
    </div>
  );
};

const Tab = (props: ITab) => {
  const { children, isActive, onClick, handleChangeStyleUnderLine } = props;
  const tabRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isActive) {
      // wait to ready text
      setTimeout(() => {
        const left = tabRef.current?.offsetLeft || 0;
        const width = tabRef.current?.offsetWidth || 0;
        handleChangeStyleUnderLine && handleChangeStyleUnderLine(left, width);
      }, 200);
    }
  }, [isActive]);

  return (
    <div
      ref={tabRef}
      className={classNames(
        "text-base font-semibold p-2 text-gray1 cursor-pointer",
        {
          "!text-black1": isActive,
        }
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const TabPanels = (props: ITabPanels) => {
  const { children, activeTab } = props;
  const tabs = React.Children.map(children, (child, index) => {
    if (child.type === TabPanel) {
      return React.cloneElement(child, {
        isActive: activeTab === index,
      });
    }
  });

  return <div className="tab-panels">{tabs}</div>;
};

const TabPanel = (props: ITabPanel) => {
  const { children, isActive } = props;
  return (
    <div
      className={classNames("hidden", {
        "!block": isActive,
      })}
    >
      {children}
    </div>
  );
};

export { Tabs, TabList, Tab, TabPanels, TabPanel };
