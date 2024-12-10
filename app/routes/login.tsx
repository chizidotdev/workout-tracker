import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Heading } from "~/components/ui/text";
import { authCookie, loadAPI, parseError } from "~/lib/api";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();

  try {
    const api = await loadAPI(request);
    await api.collection("users").authWithPassword(email, password);

    return redirect("/", {
      headers: {
        "Set-Cookie": await authCookie.serialize(api.authStore.exportToCookie()),
      },
    });
  } catch (e) {
    console.log(e);
    return { error: parseError(e) };
  }
};

export default function Login() {
  const fetcher = useFetcher<typeof action>();
  const isPending = fetcher.state !== "idle";

  useEffect(() => {
    fetcher.data?.error && toast.error(fetcher.data.error);
  }, [fetcher.data]);

  return (
    <div className="container mt-40 px-8">
      <Link to="/" className="fixed left-4 top-4">
        <Button variant="ghost">
          <ChevronLeft /> Back to home
        </Button>
      </Link>

      <Heading className="text-center">Login</Heading>

      <fetcher.Form method="post" className="mt-8 flex flex-col gap-4">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input required name="email" type="email" placeholder="user@example.com" />
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input required name="password" type="password" placeholder="********" />
        </div>

        <Button isLoading={isPending} className="my-2" type="submit">
          Login
        </Button>
      </fetcher.Form>

      <a href="https://wa.link/eaxqm3" className="mt-4 flex w-full flex-col">
        <Button variant="ghost">Request account.</Button>
      </a>
    </div>
  );
}
