"use client";

import Link from "next/link";
import Icon from "../media/Icon";

export type MenuButtonProps = {
  navPath: string;
  title: string;
  icon: string;
};

export default function MenuButton(props: MenuButtonProps) {
  const { navPath, title, icon } = props;
  return (
    <Link
      className="py-2 px-5 hover:border-slate-700 border-b-4 border-b-background rounded-md"
      href={navPath}
    >
      {icon && <Icon icon={icon} variant="ui" />}
      {title}
    </Link>
  );
}
