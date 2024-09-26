import Link from 'next/link'

export type MenuButtonProps = {
  navPath: string;
  title: string;
  icon: string;
}


export default function MenuButton(props: MenuButtonProps) {
  const { navPath, title } = props;
  return (
    <Link
      href={navPath}
    >
      {title}
    </Link>
  )
}
