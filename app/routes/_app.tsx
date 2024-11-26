import { Outlet } from "@remix-run/react";

import { Navbar } from "~/components/navbar";

export default function AppLayout() {
  return (
    <main>
      <Outlet />
      <Navbar />
    </main>
  );
}
