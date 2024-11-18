import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { RecordAuthResponse } from "pocketbase";
import { Button } from "~/components/ui/button";
import { Heading, Paragraph } from "~/components/ui/text";
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

  function logout() {
    api.authStore.clear();
    queryClient.invalidateQueries({ queryKey: authQueryKey });
    return navigate("/login");
  }

  return (
    <div className="mt-10 space-y-6">
      <Heading variant="h2">Profile</Heading>

      <Paragraph>Logged in as {userData.email}</Paragraph>

      <Button onClick={logout} variant="outline">
        Logout
      </Button>
    </div>
  );
}
