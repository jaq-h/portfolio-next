'use client';

import Image from "next/image";
import MenuButton from "./MenuButton"
// import MenuButtonProps from "./MenuButton"
import styled from "styled-components";

import bugsImage from "/public/bugs.png";

const menuButtonData = [
  {
    title: "About",
    navPath: "/about",
    icon: "perosn"
  },
  {
    title: "Projects",
    navPath: "/projects",
    icon: "html"
  },
  {
    title: "GitHub",
    navPath: "https://github.com/jaq-h",
    icon: "git"
  },

]



export default function MenuBar(props: any) {
  return (
    <div className="flex items-center mx-auto sm:px10  px-20 py-1 lg:max-w-screen-lg sm:max-w-screen-sm max-w-s" >
      <Image src={bugsImage} alt="" width={69} height={69} />
      <div className="justify-items-start">
        {menuButtonData && menuButtonData.map((button, index) => {
          return (
            <li style={{ listStyle: "none", display: "inline-flex", paddingInline: "1rem" }} key={index}>
              <MenuButton
                navPath={button.navPath}
                title={button.title}
                icon={button.icon}
              />
            </li>
          );
        })
        }
      </div>
    </div>
  );
}
