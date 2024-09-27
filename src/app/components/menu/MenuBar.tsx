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
    <div className="ml-5 px-7 flex items-center" >
      <Image src={bugsImage} alt="" width={69} height={69} />
      <div className="justify-items-start">
        {menuButtonData && menuButtonData.map((button) => {
          return (
            <li style={{listStyle: "none", display:"inline-flex", paddingInline:"1rem"}}>
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
