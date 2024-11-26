import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Heading, Paragraph } from "~/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { authCookie, loadAPI, requireAuth } from "~/lib/api";

export const action = async () => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", { maxAge: -1 }),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const api = await loadAPI(request);
  const userData = await requireAuth(api);

  return { userData };
};

export const clientLoader = cacheClientLoader;
clientLoader.hydrate = true;

export default function SomeParent() {
  const { userData } = useCachedLoaderData<typeof loader>();
  const { submit, state } = useFetcher();

  function logout() {
    submit("", { method: "post" });
  }

  return (
    <div className="mt-10 space-y-4">
      <Heading variant="h2">Profile</Heading>

      <Card>
        <CardHeader>
          <Paragraph>Logged in as {userData.email}</Paragraph>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button isLoading={state !== "idle"} onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Heading variant="h4">Theme</Heading>
        </CardHeader>
        <CardContent className="space-y-2">
          <ModeToggle />
        </CardContent>
      </Card>
    </div>
  );
}

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <ToggleGroup value={theme} onValueChange={setTheme} type="single" variant="outline">
      <ToggleGroupItem value="system" aria-label="Toggle bold">
        <LaptopMinimal className="size-4" /> System
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Toggle italic">
        <Sun className="size-4" /> Light
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle strikethrough">
        <Moon className="size-4" /> Dark
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
