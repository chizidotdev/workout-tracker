import { ClientLoaderFunctionArgs, Outlet, useLoaderData } from "@remix-run/react";
import { Heading } from "~/components/ui/text";

export const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
  return {};
};

export default function SomeParent() {
  const {} = useLoaderData<typeof clientLoader>();

  return (
    <div className="mt-10 space-y-6">
      <Heading variant="h2">Profile</Heading>

      <Outlet />
    </div>
  );
}
