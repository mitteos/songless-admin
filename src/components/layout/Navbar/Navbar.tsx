import { useState } from "react";
import {
  IconCalendarEventFilled,
  IconHome2,
  IconJoker,
  IconLogout,
  IconMusic,
  IconPlayCard1,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import classes from "./Navbar.module.css";
import { Link } from "react-router";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  path?: string;
  onClick?: () => void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  path,
  onClick,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link to={path || "/"}>
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
        >
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", path: "/" },
  { icon: IconMusic, label: "Музыка", path: "/music" },
  { icon: IconPlayCard1, label: "Плейлисты", path: "/stack" },
  { icon: IconJoker, label: "Жанры", path: "/genre" },
  { icon: IconCalendarEventFilled, label: "Год", path: "/years" },
];

export function Navbar() {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      path={link.path}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center className="text-[24px] font-bold">SL</Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
