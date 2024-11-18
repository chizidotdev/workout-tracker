import { NavLink } from "@remix-run/react";
import { Dumbbell, History, House, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

import styles from "./navbar.module.css";
import { Paragraph } from "./ui/text";

const navLinks = [
  { title: "Home", icon: motion(House), href: "/" },
  { title: "Workout", icon: motion(Dumbbell), href: "/workout" },
  { title: "Logs", icon: motion(History), href: "/logs" },
  { title: "Profile", icon: motion(User), href: "/profile" },
];

const MotionParagraph = motion(Paragraph);
export function Navbar() {
  return (
    <>
      <nav className="fixed inset-x-1 bottom-4 z-50 mx-auto flex w-[85vw] max-w-80 items-center justify-around gap-2">
        {navLinks.map((link) => (
          <NavLink key={link.title} to={link.href}>
            {({ isActive }) => (
              <div
                className={cn(
                  "relative flex items-center gap-2 text-muted-foreground",
                  isActive && "px-4 py-2"
                )}
              >
                <link.icon layout className={cn("size-5", isActive && "text-primary")} />
                {isActive && (
                  <>
                    <motion.div
                      layoutId="background"
                      className="absolute inset-0 -z-10 rounded-md border bg-muted"
                    />
                    <MotionParagraph
                      layout="position"
                      layoutId="title"
                      className="block font-medium text-foreground"
                    >
                      {link.title}
                    </MotionParagraph>
                  </>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.gradient}>
        {Array(6)
          .fill(0)
          .map((i, idx) => (
            <div key={i + idx} />
          ))}
      </div>
    </>
  );
}
