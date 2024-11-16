import { NavLink } from "@remix-run/react";
import { Dumbbell, History, House, User } from "lucide-react";
import { cn } from "~/lib/utils";

import { Paragraph } from "./ui/text";

export function Navbar() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[85vw] max-w-md items-center justify-around gap-2 rounded-full border bg-background px-4 py-3">
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 text-muted-foreground",
              isActive && "rounded-md border bg-muted px-4 py-2"
            )
          }
        >
          {({ isActive }) => (
            <>
              <link.icon className={cn("size-5", isActive && "text-primary")} />
              <Paragraph className={cn("hidden font-medium", isActive && "block text-foreground")}>
                {link.title}
              </Paragraph>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

const navLinks = [
  { title: "Home", icon: House, href: "/" },
  { title: "Workout", icon: Dumbbell, href: "/workout" },
  { title: "Logs", icon: History, href: "/logs" },
  { title: "Profile", icon: User, href: "/profile" },
];
