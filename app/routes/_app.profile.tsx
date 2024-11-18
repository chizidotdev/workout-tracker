import { redirect, useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { RecordAuthResponse } from "pocketbase";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Heading, Paragraph } from "~/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api, authQueryKey, queryClient } from "~/lib/api";
import { UsersResponse } from "~/lib/types";

export const clientLoader = async () => {
  const data = queryClient.getQueryData<RecordAuthResponse<UsersResponse<unknown>>>(authQueryKey);
  if (data) return data.record;

  try {
    const userData = await api.collection("users").authRefresh();
    queryClient.setQueryData(authQueryKey, userData);

    return userData.record;
  } catch (e) {
    return redirect("/login");
  }
};

export default function SomeParent() {
  const navigate = useNavigate();
  const userData = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();

  function logout() {
    api.authStore.clear();
    queryClient.invalidateQueries();
    revalidator.revalidate();
    return navigate("/login");
  }

  return (
    <div className="mt-10 space-y-4">
      <Heading variant="h2">Profile</Heading>

      <Card>
        <CardHeader>
          <Paragraph>Logged in as {userData.email}</Paragraph>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={logout} variant="outline">
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
