import {
  type ClientActionFunctionArgs,
  Form,
  Link,
  redirect,
  useNavigation,
} from "@remix-run/react";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Heading } from "~/components/ui/text";
import { api } from "~/lib/api";

export default function Login() {
  const { state } = useNavigation();

  return (
    <div className="container mt-40 px-8">
      <Link to="/" className="fixed left-4 top-4">
        <Button variant="ghost">
          <ChevronLeft /> Back to home
        </Button>
      </Link>

      <Heading className="text-center">Login</Heading>

      <Form method="post" navigate={false} className="mt-6 flex flex-col gap-3">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input required name="email" type="email" placeholder="user@example.com" />
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input required name="password" type="password" placeholder="********" />
        </div>

        <Button className="my-2" type="submit">
          Login
        </Button>
      </Form>

      <Link to="/register" className="fixed bottom-6 left-4">
        <Button isLoading={state === "submitting"} variant="outline">
          Request account.
        </Button>
      </Link>
    </div>
  );
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();

  try {
    await api.collection("users").authWithPassword(email, password);
    return redirect("/");
  } catch (error) {
    console.log(error);
  }

  return null;
};
