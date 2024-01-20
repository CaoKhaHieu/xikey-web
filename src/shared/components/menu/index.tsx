import { ReactElement } from "react";
import classNames from "classnames";

interface IMenu {
  className?: string;
  children: ReactElement;
}

export interface IMenuData {
  id: number;
  tooltip: string;
  icon: any;
  active: boolean;
}

interface IMenuItem {
  menu: IMenuData;
  className?: string;
}

const Menu = (props: IMenu) => {
  const { className } = props;
  return <div className={classNames("", className)}>{props.children}</div>;
};

const MenuItem = (props: IMenuItem) => {
  const { menu, className } = props;
  const { id, tooltip, icon, active } = menu;
  return <div className={classNames("cursor-pointer", className)}>{icon}</div>;
};

export { Menu, MenuItem };
