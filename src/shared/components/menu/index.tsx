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
  isHidden?: boolean;
  onClick?: () => void
}

interface IMenuItem {
  menu: IMenuData;
  className?: string;
  onClick?: () => void;
}

const Menu = (props: IMenu) => {
  const { className } = props;
  return <div className={classNames("", className)}>{props.children}</div>;
};

const MenuItem = (props: IMenuItem) => {
  const { menu, className, onClick } = props;
  const { icon } = menu;
  return <div className={classNames("cursor-pointer", className)} onClick={onClick}>{icon}</div>;
};

export { Menu, MenuItem };
