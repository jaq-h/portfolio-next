import MenuButton from "./MenuButton"
import MenuButtonProps from "./MenuButton"

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
    <div>
      {menuButtonData && menuButtonData.map((button) => {
        return (
          <MenuButton
            navPath={button.navPath}
            title={button.title}
            icon={button.icon}
          />
        );
      })
      }
    </div>
  );
}
