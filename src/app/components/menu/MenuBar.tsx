'use client';

import Image from "next/image";
import MenuButton from "./MenuButton"
import bugsImage from "/public/bugs.png";

const menuButtonData = [
  {
    title: "Jacques Hebert",
    navPath: "/about",
    icon: ""
  },
  {
    title: "Projects",
    navPath: "/projects",
    icon: "icon-html"
  },
  {
    title: "Github",
    navPath: "https://github.com/jaq-h",
    icon: "github"
  },
  {
    title: "LinkedIn",
    navPath: "https://www.linkedin.com/in/jaq-h/",
    icon: "linkedin"
  }

]



export default function MenuBar() {
  return (

    <div className="flex bg-gray-950 items-center mx-auto py-1  px-2 sm:px-5 sm:max-w-screen-lg max-w-s" >
      <Image src={bugsImage} alt="" width={"69"} height={69} />
      <div className="justify-items-start">
        <ul>
          {menuButtonData && menuButtonData.map((button, index) => {
            return (
              <li className="list-none inline-flex py-1  px-2  sm:px-3 first:pl-4" key={index}>
                <MenuButton
                  navPath={button.navPath}
                  title={button.title}
                  icon={button.icon}
                />
              </li>
            );
          })
          }
        </ul>
      </div>
    </div>
  );
}
