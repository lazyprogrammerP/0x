import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaCog } from "react-icons/fa";
import {
  FaBarsStaggered,
  FaCube,
  FaMessage,
  FaUserGroup,
} from "react-icons/fa6";

type INavItems = {
  id: number;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems = [
  { id: 1, label: "Overview", href: "/dashboard/overview", icon: <FaCube /> },
  {
    id: 2,
    label: "Agentic Team",
    href: "/dashboard/team",
    icon: <FaUserGroup />,
  },
  {
    id: 3,
    label: "Conversations",
    href: "/dashboard/conversations",
    icon: <FaMessage />,
  },
  { id: 4, label: "Settings", href: "/dashboard/settings", icon: <FaCog /> },
] satisfies INavItems[];

const Nav = () => {
  const pathname = usePathname();

  return (
    <div className={"drawer lg:drawer-open w-auto"}>
      <input id={"nav"} type={"checkbox"} className={"drawer-toggle"} />

      <label htmlFor={"nav"} className={"btn drawer-button lg:hidden"}>
        <FaBarsStaggered />
      </label>

      <div className={"drawer-side"}>
        <label
          htmlFor={"nav"}
          aria-label={"close sidebar"}
          className={"drawer-overlay"}
        ></label>

        <ul
          className={
            "menu w-80 min-h-full p-8 space-y-2 text-base-content bg-base-200"
          }
        >
          {navItems.map((navItem) => (
            <li key={navItem.id}>
              <Link
                href={navItem.href}
                className={`w-full flex items-center gap-2 ${
                  navItem.href === pathname ? "bg-base-100" : ""
                }`}
              >
                {navItem.icon}
                <span>{navItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
